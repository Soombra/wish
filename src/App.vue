<template>
  <div id="app">
    <draw-table
      v-if="wishesTodo.length"
      :shouldRotate="shouldRotate"
      :items="wishesTodo"
      @finish="handleChoose"
    />
    <div class="options">
      <el-button type="primary" @click="showDialog = true">添加心愿</el-button>
    </div>
    <div v-if="wishDoing.title" class="doing">
      <h3>进行中:</h3>
      <p>{{ wishDoing.title }}</p>
      <el-button type="primary" @click="handleDone">已完成</el-button>
      <el-button @click="handleFail">废弃</el-button>
    </div>
    <!--<div>-->
    <!--<label>完成的心愿</label>-->
    <!--<ul>-->
    <!--<li v-for="(item, key) in wishesDone" :key="key">{{ item.title }}</li>-->
    <!--</ul>-->
    <!--</div>-->
    <!--<div>-->
    <!--<label>废弃的心愿</label>-->
    <!--<ul>-->
    <!--<li v-for="(item, key) in wishesFail" :key="key">{{ item.title }}</li>-->
    <!--</ul>-->
    <!--</div>-->
    <el-dialog width="400px" title="填写心愿" :visible.sync="showDialog">
      <el-input v-model="newWish"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="createWish">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import drawTable from "./components/draw-table";
export default {
  name: "app",
  components: {
    drawTable
  },
  data() {
    return {
      newWish: "",
      wishDoing: {},
      wishesTodo: [],
      wishesDone: [],
      wishesFail: [],
      shouldRotate: false,
      showDialog: false
    };
  },
  methods: {
    createWish() {
      if (!this.newWish) return;
      axios.post("/wish", { title: this.newWish }).then(() => {
        this.showDialog = false;
        this.getWishes("wishesTodo", "todo");
      });
    },
    getWishes(container, status) {
      axios.get(`/wishes?status=${status}`).then(({ data }) => {
        this[container] = data;
      });
    },
    updateWishStatus(id, status) {
      return axios
        .put(`/wishes/${id}`, { status })
        .then(() => {})
        .catch();
    },
    getWishDoing() {
      axios.get("/wishes/doing").then(({ data }) => {
        this.wishDoing = data;
      });
    },
    handleChoose(wish) {
      if (this.wishDoing.title) return;
      this.updateWishStatus(wish._id, "doing").then(() => {
        this.shouldRotate = true;
        setTimeout(() => {
          this.wishDoing = wish;
        }, 8000);
      });
    },
    handleDone() {
      this.$confirm("真的做完了嘛？").then(() => {
        this.updateWishStatus(this.wishDoing._id, "done")
          .then(() => {
            this.wishDoing = {};
            this.getWishes("wishesDone", "done");
          })
          .catch();
      });
    },
    handleFail() {
      this.$confirm("真的不想去做了？").then(() => {
        this.updateWishStatus(this.wishDoing._id, "fail")
          .then(() => {
            this.wishDoing = {};
            this.getWishes("wishesFail", "fail");
          })
          .catch();
      });
    }
  },
  mounted() {
    this.getWishes("wishesTodo", "todo");
    this.getWishes("wishesDone", "done");
    this.getWishes("wishesFail", "fail");
    this.getWishDoing();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.options {
  margin-top: 10px;
}
.doing {
  margin-top: 50px;
}
</style>
