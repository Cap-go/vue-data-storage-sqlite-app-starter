<template>
  <div id="default-container">
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
  name: 'DefaultTest',
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
    const defaultTest = async (): Promise<boolean>  => {
      setLog(log.value.concat("**** Starting Test Default Store ****\n"));
      try { 
        // open store
        await storageSqlite.openStore({});
        setLog(log.value.concat("openStore was successful \n"));
        // clear the store 
        await storageSqlite.clear();
        setLog(log.value.concat("clear was successful \n"));
        // store a string 
        await storageSqlite.setItem("session","Session Opened");
        const session = await storageSqlite.getItem('session');
        if(session != "Session Opened") {
          errMess = `setItem/getItem session failed`;
          return false;
        } else {
          setLog(log.value.concat("setItem/getItem session was successful \n"));
        }
        // store a JSON Object in the default store
        const data = {'a':20,'b':'Hello World','c':{'c1':40,'c2':'cool'}};
        await storageSqlite.setItem("testJson",JSON.stringify(data));
        const testJson = await storageSqlite.getItem("testJson");
        if( testJson != JSON.stringify(data) ) {
          errMess = `setItem/getItem testJson failed`;
          return false;
        } else {
          setLog(log.value
                .concat("setItem/getItem testJson was successful \n"));
        }
        // store a number in the default store
        const data1 = 243.567;
        await storageSqlite.setItem("testNumber",data1.toString());
        // read number from the store
        const testNumber = Number(await storageSqlite.getItem("testNumber"));
        if( testNumber != data1 ) {
          errMess = `setItem/getItem testNumber failed`;
          return false;
        } else {
          setLog(log.value
              .concat("setItem/getItem testNumber was successful \n"));
        }
        // isKey tests
        const iskey: boolean = await storageSqlite.isKey('testNumber');
        if( !iskey ) {
          errMess = `isKey testNumber failed`;
          return false;
        } else {
          setLog(log.value.concat("isKey testNumber was successful \n"));
        }
        const iskey1: boolean = await storageSqlite.isKey('foo');
        if( iskey1 ) {
          errMess = `isKey foo failed`;
          return false;
        } else {
          setLog(log.value.concat("isKey foo was successful \n"));
        }
        // Get All Keys
        const keys: string[] = await storageSqlite.getAllKeys();
        if(keys.length != 3) {
          errMess = `getAllKeys failed`;
          return false;
        } else {
          for(let i = 0; i< keys.length;i++) {
            setLog(log.value.concat(' key[' + i + "] = " + keys[i] + "\n"));
          }
          setLog(log.value.concat("getAllKeys was successful \n"));
        }
        // Get All Values
        const values: string[] = await storageSqlite.getAllValues();
        if(values.length != 3) {
          errMess = `getAllValues failed`;
          return false;
        } else {
          for(let i = 0; i< values.length;i++) {
            setLog(log.value.concat(' key[' + i + "] = " + values[i] + "\n"));
          }
          setLog(log.value.concat("getAllValues was successful \n"));
        }
        // Get All KeysValues
        const keysvalues: any[] = await storageSqlite.getAllKeysValues();
        if(keysvalues.length != 3) {
          errMess = `getAllKeysValues failed`;
          return false;
        } else {
          setLog(log.value.concat("getAllKeysValues was successful \n"));
        }
        // Remove a key 
        await storageSqlite.removeItem('testJson')
        setLog(log.value.concat("removeItem was successful \n"));

        // Get All Keys
        const keys1: string[] = await storageSqlite.getAllKeys();
        if(keys1.length != 2) {
          errMess = `getAllKeys after removeItem failed`;
          return false;
        } else {
          for(let i = 0; i< keys1.length;i++) {
            setLog(log.value.concat(' key[' + i + "] = " + keys1[i] + "\n"));
          }
          setLog(log.value
                .concat("getAllKeys after removeItem was successful \n"));
        }
        setLog(log.value
          .concat("\n**** Test Default Store was successful ****\n")); 
        return true;
      } catch (err) {
          errMess = `${err}`;
          return false;
      }
    };
    onMounted(async () => {
        // Running the test
        const retDefaultTest: boolean = await defaultTest();
        console.log(`retDefaultTest ${retDefaultTest}`);
        if(!retDefaultTest) {
            setLog(log.value
                .concat("* defaultTest failed *\n"));
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
