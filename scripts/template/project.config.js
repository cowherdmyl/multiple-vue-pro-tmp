module.exports = {
  // css适配方案(vw|rem|none)，默认为vw
  // 如果有需求需要用rem方案，比如用one-screen.js做一屏展示，可以用rem
  cssUnit: 'vw',
  // 自定义html <head></head> 部分内容
  head: {
    title: '',
    meta: [],
    link: [],
    style: [],
    script: []
  },
  // 是否开启webp图片支持
  webpSupport: true,
  // 需要忽略文件大小的图片
  imagesIgnoreSizeList: [
    // 相对于views同级目录 'assets/images/example.png'
  ],
  // 需要忽略文件大小的视频
  videosIgnoreSizeList: [
    // 相对于views同级目录 'assets/video/example.mp4'
  ]
}
