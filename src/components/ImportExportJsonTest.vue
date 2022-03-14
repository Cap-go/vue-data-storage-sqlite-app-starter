<template>
  <div id="import-export-container">
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
  name: 'ImportExportJsonTest',
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
    const jsonData1 = {
      database: "testImport",
      encrypted: false,
      tables: [
        {
          name: "myStore1",
          values: [
            {key: "test1", value: "my first test"},
            {key: "test2", value: JSON.stringify({a: 10, b: 'my second test', c:{k:'hello',l: 15}})},
          ]
        },
        {
          name: "myStore2",
          values: [
            {key: "test1", value: "my first test in store2"},
            {key: "test2", value: JSON.stringify({a: 20, b: 'my second test in store2 ', d:{k:'hello',l: 15}})},
            {key: "test3", value: "100"},
          ]
        },
      ]
    }
    const jsonData2 = {
      database: "testJsonEncrypted",
      encrypted: true,
      tables: [
        {
          name: "myStore1",
          values: [
            {key: "etest1", value: "my first test"},
            {key: "etest2", value: JSON.stringify({a: 10, b: 'my second test', c:{k:'hello',l: 15}})},
          ]
        },
        {
          name: "myStore2",
          values: [
            {key: "etest1", value: "my first test in store2"},
            {key: "etest2", value: JSON.stringify({a: 20, b: 'my second test in store2 ', d:{k:'hello',l: 15}})},
            {key: "etest3", value: "100"},
          ]
        },
      ]
    }

    const importExportJsonTest = async (): Promise<boolean>  => {
      setLog(log.value.concat("**** Starting Test Import/Export Json Store ****\n"));
      try { 
        const bRet = await storageSqlite.isJsonValid(JSON.stringify(jsonData1));
        setLog(log.value.concat(` > isJsonValid ${bRet} \n`));
        if(!bRet) {
          errMess = `isJsonValid jsonData1 not valid`;
          return false;
        }
        await storageSqlite.importFromJson(JSON.stringify(jsonData1));
        setLog(log.value.concat(` > importFromJson jsonData1 successful \n`));
        // open the store
        await storageSqlite.openStore({database: "testImport", table: "myStore1"});
        // test isKey
        let result = await storageSqlite.isKey("test1");
        setLog(log.value.concat(` > isKey myStore1 test1 ${result} \n`));
        if(!result) {
          errMess = "isKey myStore1 test1 failed";
          return false;
        }
        result = await storageSqlite.isKey("test2");
        setLog(log.value.concat(` > isKey myStore1 test2 ${result} \n`));
        if(!result) {
          errMess = "isKey myStore1 test2 failed";
          return false;
        }
        // test getAllKeys
        let resKeys = await storageSqlite.getAllKeys();
        setLog(log.value.concat(` > Get keys myStore1 result ${resKeys} \n`));    
        if(resKeys.length !== 2 || resKeys[0] !== "test1"
            || resKeys[1] !== "test2") {
          errMess = "getAllKeys myStore1 failed";
          return false;
        }
        // test getAllValues
        let resValues = await storageSqlite.getAllValues();
        setLog(log.value.concat(` > Get values myStore1 result ${resValues} \n`));    
        if(resValues.length !== 2 || resValues[0] !== "my first test"
            || resValues[1] !== JSON.stringify({a: 10, b: 'my second test', c:{k:'hello',l: 15}})) {
          errMess = "getAllValues myStore1 failed";
          return false;
        }

        // get store 2
        await storageSqlite.setTable("myStore2");
        // test getAllKeys
        resKeys = await storageSqlite.getAllKeys();
        setLog(log.value.concat(` > Get keys myStore2 result ${resKeys} \n`));    
    
        if(resKeys.length !== 3 || resKeys[0] !== "test1"
            || resKeys[1] !== "test2" || resKeys[2] !== "test3") {
          errMess = "getAllKeys myStore2 failed";
          return false;
        }
        // test getAllValues
        resValues = await storageSqlite.getAllValues();
        setLog(log.value.concat(` > Get values myStore2 result ${resValues} \n`));    
        if(resValues.length !== 3 || resValues[0] !== "my first test in store2"
            || resValues[1] !== JSON.stringify({a: 20, b: 'my second test in store2 ', d:{k:'hello',l: 15}})
            || resValues[2] !== "100") {
          errMess = "getAllValues myStore2 failed";
          return false;
        }
        // close the store
        const platform = await storageSqlite.getPlatform();
        if(platform.platform !== "web") {
          await storageSqlite.closeStore({database:"testImport"});
        }
        // exportToJson
        await storageSqlite.openStore({database:"testImport", table: "myStore1"});
        const retJson = await storageSqlite.exportToJson();
        setLog(log.value.concat(` > exportToJson successful \n`));    
        if(retJson.tables.length !== 2 ||
          retJson.tables[0].name !== "myStore1" ||
          retJson.tables[0].values?.length !== 2 ||
          retJson.tables[1].name !== "myStore2" ||
          retJson.tables[1].values?.length !== 3
        ) {
          errMess = "exportToJson failed";
          return false;
        }
        const bRetEx = await storageSqlite.isJsonValid(JSON.stringify(retJson));
        setLog(log.value.concat(` > isJsonValid exported Json object ${bRet} \n`));    
        if(!bRetEx) {
          errMess = "returned exported json object not valid";
          return false;
        }
        // get tables
        const tables: string[] = await storageSqlite.getAllTables();
        setLog(log.value.concat(` > Get tables result ${tables} \n`));    
        if(tables.length !== 2 || tables[0] !== "myStore1" || tables[1] !== "myStore2") {
          errMess = "getAllTables exported json object failed";
          return false;
        }
        let res: boolean = await storageSqlite.isTable({table: "myStore1"});
        if(!res) {
          errMess = "isTable myStore1 failed";
          return false;
        }
        res = await storageSqlite.isTable({table: "myFoo"});
        if(res) {
          errMess = "isTable myFoo failed";
          return false;
        }
        resValues = await storageSqlite.getAllValues();
        setLog(log.value.concat(` > Get values myStore1 result ${resValues} \n`));    
        if(resValues.length !== 2 || resValues[0] !== "my first test"
            || resValues[1] !== JSON.stringify({a: 10, b: 'my second test', c:{k:'hello',l: 15}})) {
          return Promise.reject(new Error("getAllValues failed"));
        }

        if (platform.platform === "ios" || platform.platform === "android") {
          // test encrypted
          const bERet = await storageSqlite.isJsonValid(JSON.stringify(jsonData2));
          setLog(log.value.concat(` > isJsonValid jsonData2 ${bRet} \n`));    
          if(!bERet) {
            errMess = "isJsonValid jsonData2 not valid";
            return false;
          }      
        }
        await storageSqlite.importFromJson(JSON.stringify(jsonData2));
        setLog(log.value.concat(` > importFromJson jsonData2 successful \n`));
        // open the store
        await storageSqlite.openStore({database: "testJsonEncrypted", table: "myStore1",
                                       encrypted: true, mode: 'secret'});
        // test getAllKeys
        resKeys = await storageSqlite.getAllKeys();
        setLog(log.value.concat(` > Get keys encrypted myStore1 result ${resKeys} \n`));    
        if(resKeys.length !== 2 || resKeys[0] !== "etest1"
            || resKeys[1] !== "etest2") {
          errMess = "getAllKeys encrypted myStore1 failed";
          return false;
        }
        // get store 2
        await storageSqlite.setTable("myStore2");
        // test getAllKeys
        resKeys = await storageSqlite.getAllKeys();
        setLog(log.value.concat(` > Get keys encrypted myStore2 result ${resKeys} \n`));    
    
        if(resKeys.length !== 3 || resKeys[0] !== "etest1"
            || resKeys[1] !== "etest2" || resKeys[2] !== "etest3") {
          errMess = "getAllKeys encrypted myStore2 failed";
          return false;
        }
        // close the store
        if(platform.platform !== "web") {
          await storageSqlite.closeStore({database:"testJsonEncrypted"});
        }

        setLog(log.value
          .concat("\n**** Test Import/Export Json Store was successful ****\n")); 
        return true;
      } catch (err) {
          errMess = `${err}`;
          return false;
      }
    };
    onMounted(async () => {
        // Running the test
        const retImpExpJsonTest: boolean = await importExportJsonTest();
        console.log(`retImpExpJsonTest ${retImpExpJsonTest}`);
        if(!retImpExpJsonTest) {
            setLog(log.value
                .concat("* ImportExportJsonTest failed *\n"));
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
