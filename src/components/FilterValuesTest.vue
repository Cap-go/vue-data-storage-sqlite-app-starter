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
import { defineComponent, getCurrentInstance, onMounted } from 'vue';
import { StorageSQLiteHook } from 'vue-data-storage-sqlite-hook/dist';
import { useState } from '@/composables/state';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
  name: 'FilterValuesTest',
  setup() {
    const [log, setLog] = useState("");
    const app = getCurrentInstance();
    const storageSqlite: StorageSQLiteHook = app?.appContext.config.globalProperties.$storageSqlite;
    let errMess = "";
    const showAlert = async (message: string) => {
        await Dialog.alert({
        title: 'Error Dialog',
        message: message,
        });
    };
    const filterValuesTest = async (): Promise<boolean>  => {
      setLog(log.value.concat("**** Starting Test Filter Values ****\n"));
      try {
        // open store
        await storageSqlite.openStore({database:"filterStore",table:"saveData"});
        setLog(log.value.concat("openStore was successful \n"));
    
        // clear the store 
        await storageSqlite.clear();
        setLog(log.value.concat("clear was successful \n"));

        // store data
        await storageSqlite.setItem("session","Session Lowercase Opened");
        const data = {'a':20,'b':'Hello World','c':{'c1':40,'c2':'cool'}};
        await storageSqlite.setItem("testJson",JSON.stringify(data));
        await storageSqlite.setItem("Session1","Session Uppercase 1 Opened");
        await storageSqlite.setItem("MySession2foo","Session Uppercase 2 Opened");
        const data1 = 243.567;
        await storageSqlite.setItem("testNumber",data1.toString());
        await storageSqlite.setItem("Mylsession2foo","Session Lowercase 2 Opened");
        await storageSqlite.setItem("EnduSession","Session Uppercase End Opened");
        await storageSqlite.setItem("Endlsession","Session Lowercase End Opened");
        await storageSqlite.setItem("SessionReact","Session React Opened");
        // Get All Values
        const values: string[] = await storageSqlite.getAllValues();
        if(values.length != 9) {
          errMess = `getAllValues failed`;
          return false;
        } else {
          for(let i = 0; i< values.length;i++) {
            setLog(log.value.concat(' key[' + i + "] = " + values[i] + "\n"));
          }
          setLog(log.value.concat("getAllValues was successful \n"));
        }

        // Get Filter Values Starting with "session"
        const stValues: string[] = await storageSqlite.getFilterValues("%session");
        if(stValues.length != 3) {
          errMess = `getFilterValues Start failed`;
          return false;
        } else {
          for(let i = 0; i< stValues.length;i++) {
            setLog(log.value.concat(' key[' + i + "] = " + stValues[i] + "\n"));
          }
          setLog(log.value.concat("getFilterValues Start was successful \n"));
        }
        // Get Filter Values Ending with "session"
        const endValues: string[] = await storageSqlite.getFilterValues("session%");
        if(endValues.length != 3) {
              errMess = `getFilterValues End failed`;
              return false;
        } else {
          for(let i = 0; i< endValues.length;i++) {
            setLog(log.value.concat(' key[' + i + "] = " + endValues[i] + "\n"));
          }
          setLog(log.value.concat("getFilterValues Start was successful \n"));
        }
        // Get Filter Values Containing "session"
        const contValues: string[] = await storageSqlite.getFilterValues("session");
        if(contValues.length != 7) {
              errMess = `getFilterValues Contains failed`;
              return false;
        } else {
          for(let i = 0; i< contValues.length;i++) {
            setLog(log.value.concat(' key[' + i + "] = " + contValues[i] + "\n"));
          }
          setLog(log.value.concat("getFilterValues Start was successful \n"));
        }

        setLog(log.value
          .concat("\n**** Test Filter Values was successful ****\n")); 
        return true;
      } catch (err) {
          errMess = `${err.message}`;
          return false;
      }
    };
    onMounted(async () => {
      // Running the test
      const retFilterValuesTest: boolean = await filterValuesTest();
      console.log(`retFilterValuesTest ${retFilterValuesTest}`);
      if(!retFilterValuesTest) {
        setLog(log.value
            .concat("* filterValuesTest failed *\n"));
        setLog(log.value
                .concat("\n* The set of tests failed *\n"));
        await showAlert(errMess);
      } else {
        setLog(log.value
            .concat("\n* The set of tests was successful *\n"));
      }

    });
    return { log, errMess };
  }

});
</script>
