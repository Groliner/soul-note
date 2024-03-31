# module description
...

## todo list
如何记录用户的操作痕迹?
1.用户当前浏览到日记本的第几页第几部分,
2.用户的个性化选择,
3.日记本模型的构建,是否需要对每一页内容进行段落的section划分,形成新的模型框架:diary -> diary_page -> page_content
4.

## diary module
默认包含 :create_time: 'yyyy-mm-dd', update_time: 'yyyy-mm-dd',
diary 包含当前用户的所有日记本,加载采用懒加载
const defaultDiary = [
  {
    id: 'diary_1',
    title: 'Hello World',
    create_time: Date.now(),
    update_time: Date.now()
  }
]
const defaultPages = {
  diary_book_id: 'diary_1',
  pages: [
    {
      page: 1,
      title: 'Hello World',
      content: 'Hello World',
      height: '700px',
      create_time: Date.now(),
      update_time: Date.now()
    }
  ]
}
// 如果要对日记段落进行引用,那么可以考虑如下
{
    id: "diary1",
    title: "Diary Title",
    ? belong: 'userId',
    pages: [
        {
            id: "page1",
            title: "Page Title",
            height: 'auto' / '1200px',
            sections: [
                {
                    id: "section1",
                    title: "Section Title",
                    content: "Section content..."
                },
                // 其他 sections...
            ]
        }
    ]
}
{
    id: "diary1",
    title: "Diary Title",
}
{
    diary_book_id: "diary1",
    title: "Page Title",
    height: '1200px',
    sections: [section_id, , ]
}
{
    id: "section1",
    title: "Section Title",
    content: "Section content..."
}