<template>
  <div id="filter-values-container">
    <div id="log">
        <pre>
          <p>{{log}}</p>
        </pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStorageSQLite } from 'vue-data-storage-sqlite-hook/dist';
import { useState } from '@/composables/state';

export default defineComponent({
  name: 'FilterValuesTest',
  async setup() {
    const [log, setLog] = useState("");
    const { openStore, setItem, getFilterValues,
            getAllValues, clear} = useStorageSQLite();
    setLog(log.value.concat("**** Starting Test Filter Values ****\n"));
    
    // open store
    const resOpen: boolean = await openStore(
                        {database:"filterStore",table:"saveData"});
    if( !resOpen ) {
      setLog(log.value.concat("openStore failed \n"));
      return { log };
    } else {
      setLog(log.value.concat("openStore was successful \n"));
    }
    // clear the store 
    const rClear: boolean = await clear();
    if( !rClear ) {
      setLog(log.value.concat("clear failed \n"));
      return { log };
    } else {
      setLog(log.value.concat("clear was successful \n"));
    }
    // store data
    await setItem("session","Session Lowercase Opened");
    const data = {'a':20,'b':'Hello World','c':{'c1':40,'c2':'cool'}};
    await setItem("testJson",JSON.stringify(data));
    await setItem("Session1","Session Uppercase 1 Opened");
    await setItem("MySession2foo","Session Uppercase 2 Opened");
    const data1 = 243.567;
    await setItem("testNumber",data1.toString());
    await setItem("Mylsession2foo","Session Lowercase 2 Opened");
    await setItem("EnduSession","Session Uppercase End Opened");
    await setItem("Endlsession","Session Lowercase End Opened");
    await setItem("SessionReact","Session React Opened");
    // Get All Values
    const values: string[] = await getAllValues();
    if(values.length != 9) {
      setLog(log.value.concat("getAllValues failed \n"));
      return { log };
    } else {
      for(let i = 0; i< values.length;i++) {
        setLog(log.value.concat(' key[' + i + "] = " + values[i] + "\n"));
      }
      setLog(log.value.concat("getAllValues was successful \n"));
    }

    // Get Filter Values Starting with "session"
    const stValues: string[] = await getFilterValues("%session");
    if(stValues.length != 3) {
      setLog(log.value.concat("getFilterValues Start failed \n"));
      return { log };
    } else {
      for(let i = 0; i< stValues.length;i++) {
        setLog(log.value.concat(' key[' + i + "] = " + stValues[i] + "\n"));
      }
      setLog(log.value.concat("getFilterValues Start was successful \n"));
    }
    // Get Filter Values Ending with "session"
    const endValues: string[] = await getFilterValues("session%");
    if(endValues.length != 3) {
      setLog(log.value.concat("getFilterValues End failed \n"));
      return { log };
    } else {
      for(let i = 0; i< endValues.length;i++) {
        setLog(log.value.concat(' key[' + i + "] = " + endValues[i] + "\n"));
      }
      setLog(log.value.concat("getFilterValues Start was successful \n"));
    }
    // Get Filter Values Containing "session"
    const contValues: string[] = await getFilterValues("session");
    if(contValues.length != 7) {
      setLog(log.value.concat("getFilterValues End failed \n"));
      return { log };
    } else {
      for(let i = 0; i< contValues.length;i++) {
        setLog(log.value.concat(' key[' + i + "] = " + contValues[i] + "\n"));
      }
      setLog(log.value.concat("getFilterValues Start was successful \n"));
    }

    setLog(log.value
          .concat("\n**** Test Filter Values was successful ****\n")); 
    return { log };
  }

});
</script>
