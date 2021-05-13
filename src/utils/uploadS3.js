const dotenv = require('dotenv');
const { fromBuffer } = require('file-type');
const AWS = require('../libs/aws');

dotenv.config();

class AWSS3 {
  constructor() {
    this.s3 = new AWS.S3();
  }

  async uploadS3(base64, folder, subfolder) {
    const base64Data = Buffer.from(Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
    const { ext } = await fromBuffer(base64Data);

    const timestamp = +new Date();
    const filename = `${folder}/${subfolder ? `${subfolder}/` : ''}${timestamp}.${ext}`;

    // чистим объекьты при загрузке нового фото, чтобы не засорять
    if (subfolder) {
      const params = {
        Bucket: process.env.bucketName,
        Prefix: `${folder}/${subfolder}`,
      };

      this.s3
        .listObjects(params)
        .promise()
        .then(async (data) => {
          const listedObjects = data.Contents;

          const deleteParams = {
            Bucket: process.env.bucketName,
            Delete: { Objects: [] },
          };

          listedObjects.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
          });

          if (deleteParams.Delete.Objects.length > 0) {
            await this.s3.deleteObjects(deleteParams).promise();
          }
        });
    }
    // конец скрипта чистки

    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: process.env.bucketName,
          Key: filename,
          Prefix: `${folder}/${subfolder}`,
          Body: base64Data,
          ContentEncoding: 'base64',
          ContentType: `image/${ext}`,
          ACL: 'public-read',
        },
        (err, data) => {
          if (err) {
            console.log('err', err);
            return reject(err);
          }
          console.log('data.Location', data.Location);
          return resolve(data.Location);
        }
      );
    });
  }
}

module.exports = new AWSS3();
