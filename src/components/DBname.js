import React from 'react';
import { API } from 'aws-amplify';

export default async function getDbByName(name, nameUrl) {
  console.log("nameUrl in dbname: ", name);
  await API.get("quilts", `/${name}`).then(res => console.log("Results for freshArr: ", res))
  // await freshArr;
  // console.log("freshArr at name: ", freshArr);
  // const result = freshArr.filter(item => { return item.name === name })
  // console.log("getDbByName: ", result);
  // if (result.length !== 0) { return result }
  // else return null;
  return;
}
