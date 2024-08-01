<template>
  <el-form :label-position="labelPosition" label-width="80px" :model="formState">
    <el-form-item label="名称">
      <el-input v-model="formState.name"></el-input>
    </el-form-item>
    <el-form-item label="活动区域">
      <el-input v-model="formState.region"></el-input>
    </el-form-item>
    <el-form-item label="活动形式">
      <el-input v-model="formState.hotType"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import deepClone from "../../tools/deepClone";

export default {
  name: "editMarker.form",
  data() {
    return {
      labelPosition: 'right',
      formState: {
        name: '',
        region: '',
        hotType: ''
      },
    };
  },
  methods: {
    setFormState(formData) {
      let form = deepClone(formData);
      this.formState.name = form.name || '';
      this.formState.region = form.region || '';
      this.formState.hotType = form.hotType || '';
      this.formState.latlng = form.latlng;
      this.formState.type = form.type;
      this.formState.timeId = form.timeId;
    },
    initFormState() {
      this.formState.name = '';
      this.formState.region = '';
      this.formState.hotType = '';
    },
    toFormState() {
      return deepClone(this.formState);
    }
  }
}
</script>
<style scoped>

</style>
