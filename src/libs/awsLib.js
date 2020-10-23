import { Storage, API } from "aws-amplify";

export async function s3Upload(file, callback) {
  const filename = file.name;
  let s3SignedUrl = "";
  await Storage.vault.put(filename, file, { contentType: file.type })
    .then(storagePutResult => {
      console.log("s3 storage result: ", storagePutResult)
      Storage.vault.get(storagePutResult.key)
        .then(signedUrl => {
          console.log("inside storage.get: ", signedUrl);
          s3SignedUrl = signedUrl;
          callback(signedUrl);
        });
    })
    .catch(err => {
      console.log("s3 storage err: ", err);
      return false;
    });
  return s3SignedUrl;

  // const stored = await Storage.vault.put(filename, file, {
  //   contentType: file.type
  // });
  // console.log("stored return from s3upload: ", stored);
  // return stored;
}
