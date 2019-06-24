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
      <div class="arrow">随缘</div>
    </div>
    <el-button type="primary" @click="handleChoose">随缘时间</el-button>
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
      colors: [
        "#33B5E5",
        "#99cc33",
        "#ffc20e",
        "#aa66cc",
        "#24998d",
        "#ffbb33",
        "#fedcbd",
        "#ae6642",
        "#0099cc",
        "#ff8800",
        "#ffe600",
        "#f36c21",
        "#669900",
        "#d1c7b7",
        "#cdd541",
        "#f8aba6"
      ],
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
      this.items.forEach((item, index) => {
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
        ctx.fillStyle = this.colors[index % this.colors.length];
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#fff";
        let text = item.title;
        let characterArr = [];
        if (this.items.length > 1) {
          let textWidthLimit = Math.tan(angleStep / 2) * textRadio * 2 - 8;
          let characterLimit = Math.round(textWidthLimit / fontSize);
          while (text.length > characterLimit) {
            characterArr.push(text.slice(0, characterLimit));
            text = text.slice(characterLimit);
          }
        }
        characterArr.push(text);
        ctx.font = `normal ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.closePath();
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
        transform: `rotate(${((index * angleStep) / Math.PI) * 180 + 5400}deg)`
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
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#eee";
    this.tableInit();
  }
};
</script>
<style lang="scss" scoped>
.table-container {
  height: 400px;
  width: 400px;
  border-radius: 400px;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  .arrow {
    width: 80px;
    height: 80px;
    border-radius: 50px;
    background-color: #ffff00;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaa;
    font-size: 26px;
    &::before {
      content: "";
      position: absolute;
      border: 18px solid transparent;
      border-bottom: 36px solid #ffff00;
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
