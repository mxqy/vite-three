<template>
  <div class="box" ref="threeTarget"></div>
</template>
<script>
import { defineComponent,onMounted,ref } from 'vue'
import { Engine } from './assets/js/Engine'
import { lightList } from './assets/js/Light'
import { helpList } from './assets/js/Help'
import { object3DList } from './assets/js/BasicObject'
export default defineComponent({
  setup() {
    const threeTarget = ref(null)
    onMounted(()=>{
      const TE = new Engine(threeTarget.value)
      TE.addObject(...object3DList)
      TE.addObject(...lightList)
      TE.addObject(...helpList)
      window.onresize=()=>{
        TE.onWindowResize()
      }
    })
    return {
      threeTarget
    }
  },
})
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
.box{
  width: 100%;
  height: 100%;
}
#app{
  width: 100vw;
  height: 100vh;
}
</style>

