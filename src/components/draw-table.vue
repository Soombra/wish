<template>
  <div class="draw-table">
    <div class="table-container">
      <canvas
        id="table"
        :class="{ rotate: shouldRotate }"
        :style="shouldRotate && rotateObj"
        width="400"
        height="400"
      ></canvas>
      <div class="arrow"></div>
    </div>
    <button @click="handleChoose">选一个</button>
  </div>
</template>
<script>
let ctx;
let angleStep;
const fontSize = 16;
const textRadio = 120;
export default {
  data() {
    return {
      rotateObj: {}
    };
  },
  props: {
    shouldRotate: {
      default: false
    },
    items: {
      default() {
        return ["1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888"];
      }
    }
  },
  methods: {
    tableInit() {
      ctx.clearRect(-200, -200, 400, 400);
      angleStep = (Math.PI * 2) / this.items.length;
      this.items.forEach(item => {
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          190,
          1.5 * Math.PI - angleStep / 2,
          1.5 * Math.PI + angleStep / 2
        );
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.stroke();

        let text = item.title;
        let textWidthLimit = Math.tan(angleStep / 2) * textRadio * 2 - 8;
        let characterLimit = Math.round(textWidthLimit / fontSize);
        let characterArr = [];
        while (text.length > characterLimit) {
          characterArr.push(text.slice(0, characterLimit));
          text = text.slice(characterLimit);
        }
        characterArr.push(text);
        ctx.font = `normal ${fontSize}px Arial`;
        ctx.textAlign = "center";
        characterArr.forEach((item, index) => {
          ctx.fillText(
            item,
            0,
            -textRadio + (index - characterArr.length / 2) * fontSize
          );
        });

        ctx.rotate(-angleStep);
      });
    },
    handleChoose() {
      let index = Math.round(Math.random() * (this.items.length - 1));
      const wish = this.items[index];
      this.rotateObj = {
        transform: `rotate(${((index * angleStep) / Math.PI) * 180 + 2880}deg)`
      };
      this.$emit("finish", wish);
    }
  },
  watch: {
    items() {
      this.tableInit();
    }
  },
  mounted() {
    const canvas = document.getElementById("table");
    ctx = canvas.getContext("2d");
    ctx.translate(200, 200);
    ctx.strokeStyle = "#999";
    this.tableInit();
  }
};
</script>
<style lang="scss" scoped>
.table-container {
  height: 400px;
  width: 400px;
  margin: 0 auto;
  position: relative;
  .arrow {
    width: 80px;
    height: 80px;
    border-radius: 50px;
    background-color: #66ccff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &::before {
      content: "";
      position: absolute;
      border: 20px solid transparent;
      border-bottom: 40px solid #66ccff;
      left: 50%;
      bottom: 70px;
      transform: translateX(-50%);
    }
  }
}
.rotate {
  transition: all 8s cubic-bezier(0.4, 0, 0.1, 1) 0s;
}
</style>
