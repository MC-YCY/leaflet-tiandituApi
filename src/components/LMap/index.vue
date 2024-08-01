<template>
  <div class="LMap">
    <layerListSelect :list="layerList" :active.sync="layer" @click="layerListClick"></layerListSelect>

    <div class="LMap-actions">
      <div class="LMap-actions-add" @click="clickAddPoint">
        {{ isEdit ? "点击地图添加点位" : "添加点" }}
      </div>
    </div>

    <div class="container" id="container" ref="container">

    </div>

    <editMarker @editSubmit="editSubmit" ref="RefEditMarker"></editMarker>
  </div>
</template>

<script>
import {initMap, setLayer, layerList, MapEvents, editMarkerMethod, addPopup,removePopup} from './tools/methods';
import layerListSelect from './components/layerList/layerList.vue';
import editMarker from './components/editMarker/editMarker.vue';
import deepClone from "./tools/deepClone";

export default {
  data() {
    return {
      map: null,
      layerList,
      layer: null,
      isEdit: false,
      markList: [],
      defaultMarkList:[
        {
          latlng:{
            lat:41.44272637767212,
            lng:104.150390625
          },
          name: '名字1',
          region: 'region',
          hotType: '啊我的娃'
        },
        {
          latlng:{
            lat:41.84272637767212,
            lng:124.150390625
          },
          name: '名字1',
          region: 'region',
          hotType: '啊我的娃'
        },
        {
          latlng:{
            lat:42.44272637767212,
            lng:104.150390625
          },
          name: '名字1',
          region: 'region',
          hotType: '啊我的娃'
        }
      ]
    }
  },
  components: {
    layerListSelect,
    editMarker
  },
  mounted() {
    this.map = initMap(this.$refs.container);
    setLayer(this.map, this.layer);

    let This = this;
    const events = {
      click(e) {
        if(!This.isEdit) return;
        let formState = {
          type: '添加',
          latlng: e.latlng,
          timeId:+new Date()
        }
        This.$refs.RefEditMarker.show(formState);
      },
      zoom(e) {
        console.log('zoom',e)
      }
    }
    MapEvents(this.map, events);

    this.addDefaultMarkList();
  },
  methods: {
    layerListClick() {
      setLayer(this.map, this.layer);
      //! 每次切换图层后 重新回显内容
      let deepArray = deepClone(this.markList);
      this.markList.length = 0;
      deepArray.map((item)=>{
        this.editSubmit(item.formState);
      })
    },
    clickAddPoint() {
      this.isEdit = !this.isEdit;
    },

    showPopup(formState){
      let linkSet = (formState) =>{
        formState.type = "修改";
        this.$refs.RefEditMarker.show(formState);
      }
      let linkDel = (formState) =>{
        let findK = null;
        let findItem = this.markList.find((item,index)=>{
          if(item.formState.timeId === formState.timeId){
            findK = index;
            return item;
          }
        })
        findItem.remove();
        this.markList.splice(findK,1);
        removePopup(this.map);
      }
      addPopup(this.map,formState,{click:linkSet,linkDel});
    },

    editSubmit(markFormState) {
      if(markFormState.type === '修改'){
        editMarkerMethod.edit(markFormState,this.markList)
        this.showPopup(markFormState);
      }
      if (markFormState.type === '添加' || !markFormState.type) {
        let event = {
          click: (e) => {
            this.showPopup(e.target.formState);
          },
          dblclick:(e)=>{
            let formState = e.target.formState;
            formState.type = "修改";
            this.$refs.RefEditMarker.show(formState);
          },
          move: (e) => {
            if (e.latlng) {
              e.target.formState.latlng = e.latlng;
            }
          },
          dragend: (e) => {
            if(e.target.formState.popupOpen){
              this.showPopup(e.target.formState)
            }
          }
        }
        editMarkerMethod.add(markFormState, this.map, this.markList, event);
      }
      this.isEdit = false;
    },

    addDefaultMarkList(){
      this.defaultMarkList.map((item)=>{
        this.editSubmit(item);
      })
    }
  }
}
</script>

<style scoped>
.container {
  width: 1300px;
  height: 800px;
  box-shadow: 0 0 10px #ccc;
}

.LMap {
  width: 1300px;
  height: auto;
  margin: 50px auto;
}

.container /deep/ .leaflet-control-attribution {
  display: none;
}

.LMap-actions {
  margin: 10px 0;
  display: flex;

  .LMap-actions-add {
    display: inline-flex;
    height: 32px;
    line-height: 30px;
    padding: 0 14px;
    border-radius: 3px;
    background-color: #0088ff;
    color: #fff;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
