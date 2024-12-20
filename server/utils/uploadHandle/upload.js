const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

const CLIENT_ID = process.env.Client_ID;
const CLIENT_SECRET = process.env.Client_secret;
const Redirect_url = process.env.Redirect_url;
const RefreshToken = process.env.Refresh_Token;

const oauthClient = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  Redirect_url
);
oauthClient.setCredentials({ refresh_token: RefreshToken });

const drive = google.drive({
  version: "v3",
  auth: oauthClient,
});

const fileHandle = (module.exports = {
  setPublicFile: async (fileId) => {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const getURL = await drive.files.get({
        fileId,
        fields: "webViewLink, webContentLink",
      });
      return getURL.data;
    } catch (error) {
      console.log(error);
    }
  },
  rootFolderHandle: (type) => {
    let rootFolder 
      if(type==='post-pic' || type==='post-file' )  rootFolder = process.env.Folder_Post_ID
      if(type==='user') rootFolder = process.env.Folder_User_ID
      if(type==='chat-pic' || type==='chat-file') rootFolder = process.env.Folder_Chat_ID
      return rootFolder
  }
  ,
  uploadFile: async (filePath, mimeType, fileName, type) => {
    try {
      // console.log(filePath, mimeType, fileName, type)
      const createFile = await drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: mimeType,
          parents: [fileHandle.rootFolderHandle(type)]
        },
        media: {
          mimeType: mimeType,
          body: fs.createReadStream(filePath),
        },
      });
      // console.log(createFile.data.id);
      const getURL = await fileHandle.setPublicFile(createFile.data.id);
      const display_url = `https://drive.google.com/thumbnail?id=${createFile.data.id}&sz=w500`;
      const data = {
        fileID: createFile.data.id,
        download_url: getURL.webContentLink,
        display_url: display_url,
        mimetype: mimeType,
      }
     // console.log(data);
      return data
    } catch (error) {
      console.error(error);
    }
  },
  deleteFile: async (FileID) => {
    try {
      //console.log("delete file");
      const deleteFile = await drive.files.delete({
        fileId: FileID,
      });
      console.log("delete successfully : ", deleteFile.status);
    } catch (error) {
      console.error(error);
    }
  },
});
