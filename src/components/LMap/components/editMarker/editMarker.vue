<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">

    <editMarkerForm ref="refForm"></editMarkerForm>

    <span slot="footer" class="dialog-footer">
      <el-button @click="clickClose">取 消</el-button>
      <el-button type="primary" @click="clickSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import editMarkerForm from "./editMarker.form.vue";
export default {
  name: "editMarker",
  components:{
    editMarkerForm
  },
  data() {
    return {
      dialogVisible: false,
      title:""
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$refs.refForm.initFormState();
            done();
          })
          .catch(_ => {
          });
    },
    show(markForm) {
      this.dialogVisible = true;
      this.title = markForm.type;
      this.$nextTick(()=>{
        this.$refs.refForm.setFormState(markForm);
      })
    },
    clickSubmit(){
      let formData = this.$refs.refForm.toFormState();
      this.$emit("editSubmit",formData);
      this.dialogVisible = false;
    },
    clickClose(){
      this.$refs.refForm.initFormState();
      this.dialogVisible = false;
    }
  }
}
</script>

<style scoped>

</style>
