import { Storage } from "aws-amplify";

export async function s3Upload(file, setS3UploadReturn) {
  const filename = file.name;
  Storage.put(filename, file, { contentType: file.type })
    .then(result => {
      console.log("s3 storage result: ", result)
      setS3UploadReturn(result);
      return true;
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
