import React from 'react';
import { API } from 'aws-amplify';

export default function getDbById(id, idUrl) {
  const freshArr = async function () { await API.get("quilts", idUrl) };
  const result = freshArr.filter(item => { return item.id !== id })
  console.log("getDbById: ", result);
  if (result.length !== 0) { return result }
  else return null;
}
