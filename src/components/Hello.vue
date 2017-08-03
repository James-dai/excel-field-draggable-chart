<template>
  <div class="hello">
    <el-row class="layoutRow">
      <el-col :span="4" class="layoutLeft">
        <div class="leftArear">
          <vue-xlsx-table @on-select-file="handleSelectedFile">导入excel表格</vue-xlsx-table>
          <div style="margin: 15px;">
            <p>工作表: {{tableName || "暂无"}}</p>
            <draggable class="list-group" element="ul" v-model="tableHeader" :options="dragOptions" :move="onMove"
                       @start="isDragging=true" @end="dragFromBaseEnd">
              <transition-group type="transition" :name="'flip-list'">
                <p v-for="(element,dex) in tableHeader" :key="dex">
                  <span><span style="color: #690">{{element.type}} </span>{{element.name}}</span>
                </p>
              </transition-group>
            </draggable>

          </div>
        </div>
      </el-col>
      <el-col :span="15" class="layoutMiddle">
        <div style="border:solid 1px #bbb;padding: 5px;">
          <div style="padding: 5px;">
            <el-row>
              <el-col :span="1" style="height: 30px;line-height: 30px">纬度</el-col>
              <el-col :span="23" style="border-bottom: solid 1px #ddd;">
                <draggable element="span" v-model="list2" :options="dragOptions" :move="onMove" @end="dragFromBaseEnd">
                  <transition-group name="no" class="list-group" tag="p">
              <span class="list-span" v-for="(element,dex) in list2" :key="dex">
                {{element.name}}
              </span>
                  </transition-group>
                </draggable>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="1" style="height: 30px;line-height: 30px">度量</el-col>
              <el-col :span="23" style="border-bottom: solid 1px #ddd;">
                <draggable element="span" v-model="list3" :options="dragOptions" :move="onMove" @end="dragFromBaseEnd">
                  <transition-group name="no" class="list-group" tag="p">
              <span class="list-span" v-for="(element,dex) in list3" :key="dex">
                {{element.name}}
              </span>
                  </transition-group>
                </draggable>
              </el-col>
            </el-row>
          </div>
        </div>

        <br>
        <br>

        <ve-chart :data="chartData" :settings="chartSettings"></ve-chart>
      </el-col>
      <el-col :span="5" class="layoutRight" style="padding: 25px;">
        <el-button v-if="chartData.columns" type="primary" @click="changeType">切换图表类型</el-button>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import analyseFieldType from "../utils/analyseFiledType"
  import draggable from 'vuedraggable'

  const message = ['vue.draggable', 'draggable', 'component', 'for', 'vue.js 2.0', 'based', 'on', 'Sortablejs']

  export default {
    name: 'hello',
    components: {
      draggable,
    },
    data() {
      return {
        tableName: "",
        tableBody: [],
        tableHeader: [],
        list2: [],
        list3: [],
        isDragging: false,
        delayedDragging: false,
        chartData:{},
        chartTypeDex: 0,
        chartTypeList:['line', 'histogram', 'pie'],
        chartSettings: {type: "line"}
      }
    },
    methods: {
      handleSelectedFile (convertedData) {
        this.$prompt('请输入表名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(ret=> {
          this.tableName = ret.value;
          for (let i = 0; i < convertedData.header.length; i++) {
            let _item = convertedData.header[i];
            let item = {
              name: _item,
              type: analyseFieldType(convertedData.body, _item)
            };
            this.tableHeader.push(item)
          }
          ;

          this.tableBody = convertedData.body;
        })
      },
      onMove ({relatedContext, draggedContext}) {
//        const relatedElement = relatedContext.element;
//        const draggedElement = draggedContext.element;
//        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        return true;
      },
      dragFromBaseEnd(){
        this.isDragging=false;
        this.checkCanUseChart().then(res=>{
          this.chartData = {
            columns: [...this.list2.map(item=>item.name),...this.list3.map(item=>item.name)],
            rows: this.tableBody
          }
        })
      },
      checkCanUseChart(){
        return new Promise((resolve,reject)=>{
          resolve(['line', 'histogram', 'pie']);
        })
      },
      changeType () {
        this.chartTypeDex++
        if (this.chartTypeDex >= this.chartTypeList.length) { this.chartTypeDex = 0 }
        this.chartSettings = { type: this.chartTypeList[this.chartTypeDex] }
      }
    },
    computed: {
      dragOptions () {
        return {
          animation: 0,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost'
        };
      },
    },
    watch: {
      isDragging (newValue) {
        if (newValue) {
          this.delayedDragging = true
          return
        }
        this.$nextTick(() => {
          this.delayedDragging = false
        })
      }
    }
  }
</script>

<style>
  html, body, #app, .hello, .layoutRow, .layoutLeft, .layoutMiddle, .layoutRight {
    height: 100%;
  }

  .layoutRow {
    position: relative;
  }

  .leftArear, .layoutMiddle {
    padding: 10px;
    height: 100%;
    border-right: solid 1px #ddd;
  }
</style>
<style>
  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }

  .list-group {
    min-height: 20px;
  }

  .list-group-item {
    cursor: move;
  }

  .list-group-item i {
    cursor: pointer;
  }
</style>
