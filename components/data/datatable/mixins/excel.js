import JSZip from 'jszip'

export default {
  methods: {
    exportToExcel: function () {
      this.excelSaveFile(this.excelSheet()).then(blob => {
        const url = window.URL.createObjectURL(blob)
        let a = this.$refs.download
        a.href = url
        a.download = `exported_${new Date().getTime()}.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    excelSaveFile: function (sheetData) {
      let zip = new JSZip()
      let rels = zip.folder('_rels')
      let xl = zip.folder('xl')
      zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>')
      rels.file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>')
      xl.file('workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><fileVersion /><workbookPr /><bookViews><workbookView /></bookViews><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1" /></sheets><calcPr calcId="0" concurrentCalc="0" /><extLst></extLst></workbook>')
      xl.folder('_rels').file('workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>')
      xl.folder('worksheets').file('sheet1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews><sheetFormatPr defaultRowHeight="16" /><sheetData>${sheetData}</sheetData></worksheet>`)
      return zip.generateAsync({ type: 'blob' })
    },
    excelSheet: function () {
      const cols = this.cols
        .filter(col => col.visible)
        .map((col, i) => Object.assign(col, {
          ref: this.excelColumnRef(i)
        }))
      let data = this.excelRow(1, cols.map((col, i) =>
        this.excelCell(col.ref, 1, col.name)).join('')
      )
      this.filteredData.forEach((row, i) => {
        data += this.excelRow(i + 2, cols.map(col =>
          this.excelCell(col.ref, i + 2, this.getDisplayValue(row, col))).join('')
        )
      })
      return data
    },
    excelColumnRef: function (index) {
      let c = ''
      while (index >= 0) {
        c = String.fromCharCode(index % 26 + 65) + c
        index = Math.floor(index / 26) - 1
      }
      return c
    },
    excelRow: function (rowIndex, content) {
      return `<row r="${rowIndex}">${content}</row>`
    },
    excelCell: function (cellRef, rowIndex, content) {
      return `<c r="${cellRef}${rowIndex}" t="inlineStr"><is><t>${content}</t></is></c>`
    }
  }
}
