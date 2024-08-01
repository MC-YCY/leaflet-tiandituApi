import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import icon from '../images/xiaolong.gif';

export const KEY = `512e6b397b64c5f690cf9cca2925da1f`;

/*
* 存放地图图层切换的 服务地址
* spherical 球面墨卡托投影 服务地址
* LatLong 经纬度投影 服务地址
*
* mapLabel 用于标注信息，也就是城市的名称了，地点的名称服务信息
*
* */
export const layerList = [
    {
        name: "矢量底图",
        spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${KEY}`,
        LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=${KEY}`,
        mapLabel: {
            name: "矢量注记",
            spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${KEY}`,
            LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=${KEY}`,
        }
    },
    {
        name: "影像底图",
        spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${KEY}`,
        LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&l={z}&tk=${KEY}`,
        mapLabel: {
            name: "影像注记",
            spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${KEY}`,
            LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=cia_c&x={x}&y={y}&l={z}&tk=${KEY}`,
        }
    },
    {
        name: "地形晕渲",
        spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=${KEY}`,
        LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=ter_c&x={x}&y={y}&l={z}&tk=${KEY}`,
        mapLabel: {
            name: "影像注记",
            spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=${KEY}`,
            LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=cta_c&x={x}&y={y}&l={z}&tk=${KEY}`,
        }
    },
    {
        name: "全球境界",
        spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=${KEY}`,
        LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=ibo_c&x={x}&y={y}&l={z}&tk=${KEY}`,
        mapLabel: null
    },
    // {
    //     name: "三维地形",
    //     spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=${KEY}`,
    //     LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=ter_c&x={x}&y={y}&l={z}&tk=${KEY}`,
    //     mapLabel: {
    //         name: "三维地名",
    //         spherical: `http://t{s}.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=${KEY}`,
    //         LatLong: `http://t{s}.tianditu.gov.cn/DataServer?T=cta_c&x={x}&y={y}&l={z}&tk=${KEY}`,
    //     }
    // },
]

/**
 * 初始化 Leaflet 地图
 *
 * @param {HTMLElement} el - 地图容器的元素或元素的ID
 * @returns {L.Map} 返回一个初始化后的 Leaflet 地图实例
 */
export const initMap = (el) => {
    return L.map(el,
        {
            center: [39.912565, 116.408509],
            zoom: 5,
            maxZoom: 18,
            zoomControl: true,
            zoomAnimation: true,

        }
    );
}

/**
 * 删除地图的所有 图层，用于图层类型的切换
 *
 * @param {L.Map} map - 地图容器的元素或元素的ID
 */
export const clearLayers = (map) => {
    map.eachLayer(l => {
        if (!('formState' in l)) {        //! 如果有 formState 表示图标图标这里不删除
            map.removeLayer(l);
        }
    })

    // 清除聚合层中的所有marker
    if (map.markers) {
        map.markers.clearLayers();
    }
}

/**
 * 设置图层方法
 *
 * @param {L.Map} map - 地图容器的元素或元素的ID
 * @param {Object} layerObject - layerList[n]对象
 * */

//! 1. 每次先调用 clearLayers 清楚所有图层
//! 2. 完了之后在使用 titleLayer 设置图层对象， addTo添加到地图当中

export const setLayer = (map, layerObject) => {
    clearLayers(map);
    const {spherical, mapLabel} = layerObject;
    let layer = L.tileLayer(spherical, {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        minZoom: 1,
    });
    layer.addTo(map);

    //! 有些地图图层类型，可能没有 label 标注 这里判断
    if (mapLabel && Object.keys(mapLabel).length !== 0) {
        const {spherical: sphericalLabel} = mapLabel;
        let layerLabel = L.tileLayer(sphericalLabel, {
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            maxZoom: 18,
            minZoom: 1
        });
        layerLabel.addTo(map);
    }

    // 创建marker聚合层
    const markers = L.markerClusterGroup();
    // 创建一个自定义的LayerGroup来控制层级
    const layerGroup = L.layerGroup([markers]);
    layerGroup.addTo(map);
    // 设置层级，注意这个方法会将图层在地图中移到指定位置
    layerGroup.setZIndex(9999999999999999999999); // 设置图层的层级
    // 将markers保存到map对象上，以便后续使用
    map.markers = markers;
    map.layerGroup = layerGroup;
}

//! 地图事件的添加
export const MapEvents = (map, events) => {
    map.on('click', events.click)
    map.on('zoom', events.zoom)
}

//! marker 配置信息
const markerOption = {
    draggable: true,         //是否允许拖拽点
    icon: L.icon({
        iconUrl: icon,
        iconSize: [27, 27],
        iconAnchor: [14, 14],
    })
}


/**
 * 添加点位方法
 *
 * @param {Object} form - 点位表单信息对象
 * @param {L.Map} map - 地图实例对象
 * @param {Array} list - 存放所有点位对象数组，用来保存提交接口时
 * @param {Object} event - 事件对象包含 click dblclick 等等；采用回调形式
 * */
const addMarkerItem = (form, map, list, event) => {
    let latlng = Object.values(form.latlng);
    let marker = L.marker(latlng, markerOption);
    marker['formState'] = form;
    //! 点击打开 信息提示
    marker.on('click', event.click);
    //! 双击编辑
    marker.on('dblclick', event.dblclick);
    marker.on('dragend', event.dragend);
    marker.on('move', event.move);
    list.push(marker);
    // 将marker添加到聚合层
    marker.addTo(map.markers);  //！ 这里要有聚合功能就必须添加到这里
}

//! 编辑点位方法的对象
export const editMarkerMethod = {
    addList(formStates, map, list, event) {
        formStates.map((form) => {
            addMarkerItem(form, map, list, event)
        })
    },
    add(form, map, list, event) {
        addMarkerItem(form, map, list, event)
    },
    edit(form, list) {
        let item = list.find((v) => {
            if (v.formState.timeId === form.timeId) return v;
        })
        item.formState = {...form};
    }
}

//! popup 信息窗 只会展示一个，这里保存最新的；用来关闭使用
let POPUP = null;

//! 添加 信息窗；设置了编辑。删除功能 针对于点位的操作
export const addPopup = (map, formState, events) => {
    let {latlng} = formState;

    let dom = document.createElement("div");
    dom.innerHTML = `
        <a class="setLink">编辑</a>
        <a class="delLink">删除</a>
        <div>名字：${formState.name}</div>
        <div>活动区域：${formState.region}</div>
        <div>活动形式：${formState.hotType}</div>
    `
    dom.querySelector('.setLink').onclick = () => {
        events.click && events.click(formState);
    }

    dom.querySelector('.delLink').onclick = () => {
        events.linkDel && events.linkDel(formState);
    }
    let popup = L.popup()
        .setLatLng(latlng)
        .setContent(dom)
    popup.openOn(map);
    formState.popupOpen = true;
    popup.on('remove', () => {
        formState.popupOpen = false;
    })
    POPUP = popup;
}
//! 删除信息窗的方法
export const removePopup = (map) => {
    map.removeLayer(POPUP);
}
