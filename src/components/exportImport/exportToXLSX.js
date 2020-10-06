import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const exportToXLSX = (csvData, fileName, campos) => {
  const dataOK = [];
  dataOK.push(campos.map((item) => item[1]));

  csvData.forEach((item) => {
    let tempData = [];
    campos.forEach((camp) => {
      tempData.push(item[camp[0]]);
    });

    dataOK.push(tempData);
  });
  savePDF(dataOK, fileName);
};

const savePDF = (data, fileName) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = { Sheets: { Stock: ws }, SheetNames: ["Stock"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(dataBlob, fileName + fileExtension);
};
