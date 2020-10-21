import { Storage } from "aws-amplify";

export async function s3Upload(file, setS3UploadReturn) {
  const filename = file.name;
  await Storage.vault.put(filename, file, { contentType: file.type })
    .then(storagePutResult => {
      console.log("s3 storage result: ", storagePutResult)
      setS3UploadReturn(storagePutResult);
      Storage.vault.get(storagePutResult.key)
        .then(dbreturn => {
          console.log("inside storage.get: ", dbreturn.split("?")[0]);
        });
      // return true;
    })
    .catch(err => {
      console.log("s3 storage err: ", err);
      setS3UploadReturn(null);
      return false;
    });


  // const stored = await Storage.vault.put(filename, file, {
  //   contentType: file.type
  // });
  // console.log("stored return from s3upload: ", stored);
  // return stored;
}
