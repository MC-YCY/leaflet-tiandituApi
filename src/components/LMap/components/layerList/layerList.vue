<template>
  <div class="LMap-layerList">
    <div class="LMap-layerList-item" @click="handleClickItem(item)" :key="index" v-for="(item,index) in list" :class="{'LMap-layerList-active':isEqual(item,active)}">
      <div class="LMap-layerList-item-name">
        {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
import isEqual from "../../tools/isEqualObject";
export default {
  name: "layerList",
  props:{
    list:{
      type:Array,
      default:function(){
        return []
      }
    },
    active:{
      type:Object,
      default:function (){
        return {}
      }
    },
    onClick:{
      type:Function,
      default:function(){
        return null
      }
    }
  },
  created(){
    this.$emit("update:active", this.list[0])
  },
  methods:{
    isEqual,
    handleClickItem(item){
      this.$emit("update:active",item)
      this['onClick'](item);
      this.$emit('click', item);
    }
  }
}
</script>

<style scoped>
.LMap-layerList{
  width: 100%;
  display: flex;
  padding: 10px 0;
}
.LMap-layerList-item{
  flex: 1;
  min-height: 50px;
  box-shadow: -1px -1px 3px #8ddb8c5a,1px 1px 3px #4298f95a;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #eee;
}
.LMap-layerList-item+.LMap-layerList-item{
  margin-left: 10px;
}
.LMap-layerList-item-name{
  padding: 6px 12px;
  font-size: 14px;
  color: #000;
}
.LMap-layerList-active{
  box-shadow: -1px -1px 3px #8ddb8c,1px 1px 3px #4298f9;
  background-color: #4298f90a;
}
</style>
