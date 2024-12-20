const DataFormat = (blog) => {
  //console.log(blog)
  return {
    post_id: blog._id,
    title: blog.TieuDe,
    content: blog.NoiDung,
    ownerPost: blog.TaiKhoan_id._id,
    TaiKhoan_id: blog.TaiKhoan_id,
    fileList: blog.DinhKem.filter((file) => file.type === "post-file").map(
      (file) => ({
        _id: file._id,
        // icon: <GetIconByMimeType mimeType={file.mimeType}/>,
        name: file.name_file,
        drive_id: file.drive_file_id,
        mimeType: file.mimeType,
        url_download: file.download_url,
      })
    ),
    imageList: blog.DinhKem.filter((file) => file.type === "post-pic").map(
      (file) => ({
        _id: file._id,
        url_display: file.display_url,
        drive_id: file.drive_file_id,
        url_download: file.download_url,
      })
    ),
    likeNum: blog.LikedBy.length,
    LikedBy: blog.LikedBy,
    comments: blog.BinhLuan.map((comment) => ({
      cmt_id: comment._id,
      content: comment.NoiDung,
      user_id: comment.taiKhoan_id._id,
      UserName: comment.taiKhoan_id.userName,
      avtPic: comment.taiKhoan_id.avtPic ? comment.taiKhoan_id.avtPic.display_url : ''
    })).reverse(),
    saveNum: blog.SavedBy.length,
    commentNum: blog.BinhLuan.length,
    SavedBy: blog.SavedBy,
    Tags: blog.Tags,
    fromGroup: blog?.Group_id  ,
    createTime: blog.createdAt,
  };
};

export default DataFormat;
