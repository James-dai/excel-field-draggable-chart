function analyseFieldType(table, field) {
  let type;
  let typeCount = {
    t: 0,
    d: 0,
    v: 0
  };

  for (let i = 0; i < table.length; i++) {
    let item = table[i];

      if(/^\d+(\.\d+)?$/.test(item[field])) typeCount.v++
      else if( new Date(item[field]).getTime()>1)  typeCount.d++
      else if ((typeof item[field])== "string") typeCount.t++


    let _max=0;
    for (let k in typeCount){

      if (typeCount[k]>_max){
        _max= typeCount[k];
        type= k;
      }
    }
    return type;
  }
};
export default analyseFieldType
