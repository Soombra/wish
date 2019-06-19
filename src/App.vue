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
        <li v-for="(item, key) in wishesTodo" :key="key">{{item.title}}</li>
      </ul>
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
      wish: "",
      wishesTodo: ""
    };
  },
  methods: {
    createWish() {
      axios.post("/wish", { title: this.wish }).then(() => {
        console.log("成功");
      });
    },
    queryWishes () {
      axios.get('/wishes/todo').then(({data}) => {
        this.wishesTodo = data
      })
    }
  },
  mounted () {
    this.queryWishes()
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
