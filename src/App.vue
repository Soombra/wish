<template>
  <div id="app">
    <div>
      <label>创建心愿</label>
      <input type="text" v-model="wish" />
      <button @click="createWish">提交</button>
    </div>
    <div>
      <label>创建的心愿</label>
      <ul>
        <li v-for="(item, key) in wishesTodo" :key="key">{{ item.title }}</li>
      </ul>
    </div>
    <div v-if="wishDoing.title">
      当前正在进行的心愿: {{wishDoing.title}}
    </div>
    <div v-else>
      <button>随机选一个</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  components: {},
  data() {
    return {
      newWish: "",
      wishDoing: {},
      wishesTodo: [],
      wishesDone: [],
      wisheeFail: []
    };
  },
  methods: {
    createWish() {
      axios.post("/wish", { title: this.newWish }).then(() => {
        console.log("成功");
      });
    },
    queryWishes() {
      axios.get("/wishes/todo").then(({ data }) => {
        this.wishesTodo = data;
      });
    }
  },
  mounted() {
    this.queryWishes();
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
