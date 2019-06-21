<template>
  <div id="app">
    <div>
      <label>创建心愿</label>
      <input type="text" v-model="newWish" />
      <button @click="createWish">提交</button>
    </div>
    <div>
      <label>创建的心愿</label>
      <!--<ul>-->
      <!--<li v-for="(item, key) in wishesTodo" :key="key">{{ item.title }}</li>-->
      <!--</ul>-->
      <draw-table
        v-if="wishesTodo.length"
        :shouldRotate="shouldRotate"
        :items="wishesTodo"
        @finish="handleChoose"
      />
    </div>
    <div v-if="wishDoing.title">
      当前正在进行的心愿: {{ wishDoing.title }}
      <button @click="handleDone">完成</button>
      <button @click="handleFail">废弃</button>
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
      shouldRotate: false
    };
  },
  methods: {
    createWish() {
      if (!this.newWish) return;
      axios.post("/wish", { title: this.newWish }).then(() => {
        console.log("成功");
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
      console.log(wish.title);
      this.updateWishStatus(wish._id, "doing").then(() => {
        console.log("34343");
        this.shouldRotate = true;
        setTimeout(() => {
          this.wishDoing = wish;
        }, 8000);
      });
    },
    handleDone() {
      this.updateWishStatus(this.wishDoing._id, "done")
        .then(() => {
          this.wishDoing = {};
          this.getWishes("wishesDone", "done");
        })
        .catch();
    },
    handleFail() {
      this.updateWishStatus(this.wishDoing._id, "fail")
        .then(() => {
          this.wishDoing = {};
          this.getWishes("wishesFail", "fail");
        })
        .catch();
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
</style>
