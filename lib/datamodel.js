class SimpleTextModel {

}


class MarkdownModel extends SimpleTextModel {

}


class URLModel {

}


class JSONModel {

}


class RemoteJSONModel extends URLModel {

}


class DataModel {

}


const DataTypes = new Map([
  ['st', {
    name: 'SimpleText',
    title: 'Простой текст',
    model: SimpleTextModel
  }],
  ['md', {
    name: 'Markdown',
    title: 'Форматированный текст (Markdown)',
    model: MarkdownModel
  }],
  ['url', {
    name: 'URL',
    title: 'Ссылка',
    model: URLModel
  }],
  ['json', {
    name: 'JSON',
    title: 'Простой объект данных (JSON)',
    model: JSONModel
  }],
  ['rjson', {
    name: 'RemoteJSON',
    title: 'Данные с внешнего источника (JSON)',
    model: RemoteJSONModel
  }]
])


export {
  DataTypes,
  DataModel
}
