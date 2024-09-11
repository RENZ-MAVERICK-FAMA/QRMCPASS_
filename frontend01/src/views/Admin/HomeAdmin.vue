<template>
  <main class=" md:mt-10 p-[20px] lg:px-[5%]" >
    <div class="" >
      <div class="grid grid-cols-2 gap-5 md:gap-10" >
        <div class="bg-white p-5 rounded-[10px] shadow " >
          <h1 class="text-[40px] font-bold text-center" >{{ motorelaCount }}</h1>
          <p class="text-center md:text-left text-[20px] font-light" >Motorela</p>
        </div>
        <div class="bg-white p-5 rounded-[10px] shadow " >
          <h1 class="text-[40px] font-bold text-center" >{{ multicabCount }}</h1>
          <p class="text-center md:text-left text-[20px] font-light" >Multicab</p>
        </div>
      </div>
      <div class="bg-white shadow mt-5 md:mt-10 p-5 rounded-[20px]" >
          <p>Generate a daily report for payments and delinquency of both Multicab and Motorela.</p>
          <div class="grid md:grid-cols-3 gap-5" >
            <Fieldset legend="Daily" class="mt-3" >
              <div >
                <div class="" >
                  <label for="">Start Date</label>
                  <!-- <DatePicker v-model="startDate" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" /> -->
                  <input class="h-[40px] p-2 border w-full rounded-[5px]" type="date" id="startDate" v-model="startDate">
                </div>
                <div class="mt-3" >
                  <label for="">End Date</label>
                  <!-- <DatePicker v-model="endDate" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" /> -->
                  <input class="h-[40px] p-2 border w-full rounded-[5px]" type="date" id="endDate" v-model="endDate">
                </div>
                <div class="mt-3" >
                  <span>Motorela</span>
                  <div class="grid lg:grid-cols-2 gap-3 mt-2" >
                    <Button @click="generatedailyMotorelapayment(startDate, endDate)" label="Payment" icon="pi pi-wallet" severity="success"/>
                    <Button @click="generateDelReportMotorelaRange(startDate, endDate)" label="Deliquency" icon="pi pi-money-bill" severity="secondary"/>
                  </div>
                </div>
                <div class="mt-3" >
                  <span>Multicab</span>
                  <div class="grid lg:grid-cols-2 gap-3 mt-2" >
                    <Button @click="generatedailyMulticabpayment(startDate, endDate)" label="Payment" icon="pi pi-wallet" severity="success"/>
                    <Button @click="generateDelReportMulticabRange(startDate, endDate)" label="Deliquency" icon="pi pi-money-bill" severity="secondary"/>
                  </div>
                </div>
              </div>
            </Fieldset>
            <Fieldset legend="Monthly" class="mt-3" >
              <div >
                <div class="" >
                  <label for="">Choose month</label>
                  <input class="h-[40px] p-2 border w-full rounded-[5px]" type="month" v-model="monthlyMonth">
                </div>
                <div class="mt-3" >
                  <span>Motorela</span>
                  <div class="grid lg:grid-cols-2 gap-3 mt-2" >
                    <Button @click="generatemonthlyMotorelaPaymentReport(monthlyMonth)" label="Payment" icon="pi pi-wallet" severity="success"/>
                    <Button @click="generatemonthlyMotorelaDelinquenciesReport(monthlyMonth)" label="Deliquency" icon="pi pi-money-bill" severity="secondary"/>
                  </div>
                </div>
                <div class="mt-3" >
                  <span>Multicab</span>
                  <div class="grid lg:grid-cols-2 gap-3 mt-2" >
                    <Button @click="generatemonthlyMulticabPaymentReport(monthlyMonth)" label="Payment" icon="pi pi-wallet" severity="success"/>
                    <Button @click="generatemonthlyMulticabDelinquenciesReport(monthlyMonth)" label="Deliquency" icon="pi pi-money-bill" severity="secondary"/>
                  </div>
                </div>
              </div>
            </Fieldset>
            <Fieldset legend="Annually" class="mt-3" >
              <div class="" >
                <label for="">Year</label>
                <Select  v-model="selectedYear" :options="availableYears" class="w-full" ></Select>
                <Button  @click="GenerateOverall(selectedYear)" label="Generate Report" icon="pi pi-file-pdf" severity="success" class="mt-3 w-full" />
              </div>
            </Fieldset>
          </div>
      </div>
    </div>
  </main>
</template>
<script>
import axios from 'axios';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';


pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  data() {
    return {
      date: '',
      month:'',
      year:'',
      motorelaCount: 0,
      multicabCount: 0,
      availableYears: [],
      selectedYear: new Date().getFullYear()
      
    };
  },
  mounted() {
    this.fetchUnitCounts();
    this.populateYears();
  },
  methods: {
    GenerateOverall(selectedYear) {
      axios.get(`http://127.0.0.1:9000/admin/analytics/overall?year=${selectedYear}`)
        .then(response => {
          const data = response.data;
          this.generatePdfFile(data,selectedYear);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    generatePdfFile(data, selectedYear) {
    const totalOverall = data.total_payments + data.total_delinquencies;
    const totalPaymentsMulticab = data.total_payments_by_type.multicab*11;
    const totalpaymentsMotorela = data.total_payments_by_type.motorela*6;
    const totalTollPayments = totalPaymentsMulticab + totalpaymentsMotorela;

    const docDefinition = {
    content: [
        {
            columns: [
                {
                    stack: [
                        { text: 'Province of Bukidnon', margin: [0, 0, 0, 10] },
                        { text: 'City of Malaybalay', margin: [0, 0, 0, 10] },
                        { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', margin: [0, 0, 0, 10] },
                        { text: 'City Economic Enterprise Development and Management Office', margin: [0, 0, 0, 10] },
                        { text: 'Total Toll Payments: ' + totalTollPayments, margin: [0, 0, 0, 10] },
                        { text: 'Total Delinquencies: ' + data.total_delinquencies, margin: [0, 0, 0, 10] },
                    ],
                    alignment: 'center'  // Center alignment for the entire stack
                }
            ]
        },
        {
            table: {
                headerRows: 1,
                widths: ['auto', 'auto'],
                body: [
                    [{ text: 'Multicab', style: 'tableHeader' }, ''],
                    ['Total Payments', data.total_payments_by_type.multicab * 11],
                    ['Total Delinquencies', data.total_delinquencies_by_type.multicab]
                ]
            }
        },
        { text: '', margin: [0, 10] },
        {
            table: {
                headerRows: 1,
                widths: ['auto', 'auto'],
                body: [
                    [{ text: 'Motorela', style: 'tableHeader' }, ''],
                    ['Total Payments', data.total_payments_by_type.motorela * 6],
                    ['Total Delinquencies', data.total_delinquencies_by_type.motorela]
                ]
            }
        },
        { text: '', margin: [0, 10] },
        { text: 'Overall: ' + totalOverall, margin: [0, 0, 0, 10], bold: true, alignment: 'center' } // Centered Overall text
    ],
    styles: {
        tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black',
            alignment: 'center'  // Center alignment for table headers
        }
    }
};

    const filename = `Overall Report for ${selectedYear}.pdf`;
    pdfMake.createPdf(docDefinition).download(filename);
}

    ,populateYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2000; year--) {
      years.push(year);
    }
    this.availableYears = years;
    this.selectedYear = currentYear;
  },
    fetchUnitCounts() {
      axios.get('http://127.0.0.1:9000/admin/analytics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        this.motorelaCount = response.data.motorelaCount;
        this.multicabCount = response.data.multicabCount;
      })
      .catch((error) => {
        console.error('Error fetching unit counts:', error);
      });
    },
    generateDelReportMotorelaRange(startDate, endDate) {
  axios.get(`http://127.0.0.1:9000/admin/delinquencies/motorela/daily?start_date=${startDate}&end_date=${endDate}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
  .then((response) => {
    const delinquencies = response.data.delinquencies;
    this.generatedeldailymotorelaFile(delinquencies, startDate, endDate);
  })
  .catch((error) => {
    console.error('Error fetching delinquencies:', error);
  });
},

generatedeldailymotorelaFile(delinquencies, startDate, endDate) {

// Convert date strings to Date objects and sort by date
delinquencies.sort((a, b) => new Date(a.date_of_payment) - new Date(b.date_of_payment));

  const filename = `Motorela Delinquency Report for ${startDate}&${endDate}.pdf`;
  
  // Create table body with header row and delinquency data
  const tableHeaderRow = ['Unit', 'Date', 'Status']; // Plain text values for the header row
  const tableBody = [
    [{ text: 'Unit', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Status', style: 'tableHeader' }],
    ...delinquencies.map(delinquency => [
      delinquency.unit_id, 
      new Date(delinquency.date_of_payment).toLocaleDateString('en-US'), // Convert date to readable format
      delinquency.status
    ])
  ];

  const docDefinition = {
    content: [  
      {
        columns: [
          {
            stack: [
              { text: 'Province of Bukidnon', style: 'headerText' },
              { text: 'City of Malaybalay', style: 'headerText' },
              { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'headerText' },
              { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
              { text: 'CEEDMO Motorela Booth', style: 'headerText' },
            ],
            alignment: 'center'  // Center alignment for all text
          }
        ]
      },
      { text: '', margin: [0, 20] },  // Space below the header
      { text: `Today's Report - ${startDate} & ${endDate}`, style: 'subheader', alignment: 'center', margin: [0, 10] },
      {
        table: {
          headerRows: 1,
          widths: [100, 100, 100],
          body: tableBody
        }
      },
      { text: '', margin: [0, 10] },
      { text: 'Prepared by:', margin: [0, 30] },
      { text: '', margin: [0, 10] },
      { text: 'Verified by:', margin: [0, 30] },
      { text: '', margin: [0, 10] },
      { text: 'Approved by:', margin: [0, 30] },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: 'center'
      },
      headerText: {
        fontSize: 12,
        bold: true
      },
      subheader: {
        fontSize: 14,
        bold: true
      }
    }
  };

// Generate and download PDF
pdfMake.createPdf(docDefinition).download(`Motorela Delinquency Report for ${startDate} & ${endDate}.pdf`);
},
generateDelReportMulticabRange(startDate, endDate) {
  axios.get(`http://127.0.0.1:9000/admin/delinquencies/multicab/daily?start_date=${startDate}&end_date=${endDate}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
  .then((response) => {
    const delinquencies = response.data.delinquencies;
    this.generatedelmulticabdailyExcelFile(delinquencies, startDate, endDate);
  })
  .catch((error) => {
    console.error('Error fetching delinquencies:', error);
  });
},
generatedelmulticabdailyExcelFile(delinquencies,startDate, endDate) {
  delinquencies.sort((a, b) => new Date(a.date_of_payment) - new Date(b.date_of_payment));
  const filename = `Multicab Delinquencies Report for ${startDate}&${endDate}.pdf`;
  

  const tableHeaderRow = ['Unit', 'Date', 'Status']; // Plain text values for the header row
  const tableBody = [
    [{ text: 'Unit', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Status', style: 'tableHeader' }],
    ...delinquencies.map(delinquency => [
      delinquency.unit_id, 
      new Date(delinquency.date_of_payment).toLocaleDateString('en-US'), // Convert date to readable format
      delinquency.status
    ])
  ];

  const docDefinition = {
    content: [
      {
        columns: [
          {
            stack: [
              { text: 'Province of Bukidnon', style: 'headerText' },
              { text: 'City of Malaybalay', style: 'headerText' },
              { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'headerText' },
              { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
              { text: 'CEEDMO Motorela Booth', style: 'headerText' },
            ],
            alignment: 'center'  // Center alignment for all text
          }
        ]
      },
      { text: '', margin: [0, 20] },  // Space below the header
      { text: `Today's Report - ${startDate} & ${endDate}`, style: 'subheader', alignment: 'center', margin: [0, 10] },
      {
        table: {
          headerRows: 1,
          widths: [100, 100, 100],
          body: tableBody
        }
      },
      { text: '', margin: [0, 10] },
      { text: 'Prepared by:', margin: [0, 30] },
      { text: '', margin: [0, 10] },
      { text: 'Verified by:', margin: [0, 30] },
      { text: '', margin: [0, 10] },
      { text: 'Approved by:', margin: [0, 30] },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: 'center'
      },
      headerText: {
        fontSize: 12,
        bold: true
      },
      subheader: {
        fontSize: 14,
        bold: true
      }
    }
  };

// Generate and download PDF
pdfMake.createPdf(docDefinition).download(`Multicab Delinquency Report for ${startDate} & ${endDate}.pdf`);

},
generatedailyMulticabpayment(startDate, endDate) {
  axios.get(`http://127.0.0.1:9000/admin/transactions/payment/multicab/daily?start_date=${startDate}&end_date=${endDate}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
  .then((response) => {
    const transactions = response.data.transactions;
    this.generateMulticabPaymentExcelFile(transactions, startDate, endDate);
  })
  .catch((error) => {
    console.error('Error fetching payment transactions:', error);
  });
},
generateMulticabPaymentExcelFile(transactions, startDate, endDate) {
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const filename = `Multicab Payment Report for ${startDate}&${endDate}.pdf`;

  const docDefinition = {
    content: [
      {
        columns: [
          {
            stack: [
              { text: 'Province of Bukidnon', style: 'headerText' },
              { text: 'City of Malaybalay', style: 'headerText' },
              { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'headerText' },
              { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
              { text: 'CEEDMO Multicab Booth', style: 'headerText' },
            ],
            alignment: 'center'  // Center alignment for the entire stack
          }
        ]
      },
      { text: '', margin: [0, 20] },  // Space below the header
      { text: `Today's Report - ${startDate}&${endDate}`, style: 'subheader', alignment: 'center', margin: [0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto'],
          body: [
            [{ text: 'Unit', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Amount', style: 'tableHeader' }, { text: 'Type', style: 'tableHeader' }],
            ...transactions.map(transaction => [
              transaction.id, 
              new Date(transaction.date).toLocaleDateString('en-US'), // Convert date to readable format
              transaction.amount.toFixed(2), 
              transaction.type
            ]),
            [{ text: 'Total:', colSpan: 2, bold: true, alignment: 'right' }, {}, totalAmount.toFixed(2), '']
          ]
        }
      },
      { text: '', margin: [0, 30] },  // Add margin for spacing
      { text: 'Prepared by:', margin: [0, 30] },
      { text: '', margin: [0, 20] },  // Spacing between sections
      { text: 'Verified by:', margin: [0, 30] },
      { text: '', margin: [0, 20] },  // Spacing between sections
      { text: 'Approved by:', margin: [0, 30] },
      { text: '', margin: [0, 20] },  // Spacing between sections
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: 'center'
      },
      headerText: {
        fontSize: 12,
        bold: true
      },
      subheader: {
        fontSize: 14,
        bold: true
      }
    }
  };

pdfMake.createPdf(docDefinition).download(filename);

},
generatedailyMotorelapayment(startDate, endDate) {
  axios.get(`http://127.0.0.1:9000/admin/transactions/payment/motorela/daily?start_date=${startDate}&end_date=${endDate}`, {
      headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
  .then((response) => {
    const transactions = response.data.transactions;
    this.generateMotorelaPaymentPDF(transactions,startDate, endDate);
  })
  .catch((error) => {
    console.error('Error fetching payment transactions:', error);
  });
},
generateMotorelaPaymentPDF(transactions, startDate, endDate) {
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const filename = `Motorela Payment Report for ${startDate}&${endDate}.pdf`;

  const docDefinition = {
    content: [
      {
        columns: [
          {
            stack: [
              { text: 'Province of Bukidnon', style: 'headerText' },
              { text: 'City of Malaybalay', style: 'headerText' },
              { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'headerText' },
              { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
              { text: 'CEEDMO Motorela Booth', style: 'headerText' },
            ],
            alignment: 'center'  // Center alignment for the entire stack
          }
        ]
      },
      { text: '', margin: [0, 20] },  // Space below the header
      { text: `Today's Report - ${startDate}&${endDate}`, style: 'subheader', alignment: 'center', margin: [0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto'],
          body: [
            [{ text: 'Unit', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Amount', style: 'tableHeader' }, { text: 'Type', style: 'tableHeader' }],
            ...transactions.map(transaction => [
              transaction.id, 
              new Date(transaction.date).toLocaleDateString('en-US'), // Convert date to readable format
              transaction.amount.toFixed(2), 
              transaction.type
            ]),
            [{ text: 'Total:', colSpan: 2, bold: true, alignment: 'right' }, {}, totalAmount.toFixed(2), '']
          ]
        }
      },
      { text: '', margin: [0, 30] },  // Add margin for spacing
      { text: 'Prepared by:', margin: [0, 30] },
      { text: '', margin: [0, 20] },  // Spacing between sections
      { text: 'Verified by:', margin: [0, 30] },
      { text: '', margin: [0, 20] },  // Spacing between sections
      { text: 'Approved by:', margin: [0, 30] },
      { text: '', margin: [0, 20] },  // Spacing between sections
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: 'center'
      },
      headerText: {
        fontSize: 12,
        bold: true
      },
      subheader: {
        fontSize: 14,
        bold: true
      }
    }
  };

pdfMake.createPdf(docDefinition).download(filename);

},generatemonthlyMotorelaDelinquenciesReport() {
    const [year, month] = this.monthlyMonth.split('-').map(Number);

    axios.get(`http://127.0.0.1:9000/admin/delinquencies/motorela/monthly?month=${month}&year=${year}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then((response) => {
      const dailyReport = response.data.daily_report;
      const overallReport = response.data.overall_report;
      this.generateMonthlyReports(dailyReport, overallReport, month, year);
    })
    .catch((error) => {
      console.error('Error fetching monthly motorela delinquencies:', error);
    });
},


  generateMonthlyReports(dailyReport, overallReport, month, year) {
    
    const docDefinition = {
        content: [],
        styles: {
            header: {
                fontSize: 16,
                bold: true,
                margin: [0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 5]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        }
    };

    // Sort the dates in ascending order
    const sortedDates = Object.keys(dailyReport).sort((a, b) => new Date(a) - new Date(b));
    console.log('Daily Report for', dailyReport);

    // Add daily reports to the document content
    sortedDates.forEach(day => {
        const dailyContent = [
            {
                columns: [
                    {
                        stack: [
                            { text: 'Province of Bukidnon', style: 'header' },
                            { text: 'City of Malaybalay', style: 'header' },
                            { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'header' },
                            { text: 'City Economic Enterprise Development and Management Office', style: 'header' },
                            { text: 'CEEDMO Motorela Booth', style: 'header' }
                        ],
                        alignment: 'center'
                    }
                ]
            },
            { text: '', margin: [0, 10] },
            { text: `Daily Report   ${year}- ${month} - ${parseInt(day) + 1}`, style: 'subheader', alignment: 'center' },
            { text: '', margin: [0, 10] },
            { text: 'Unit', style: 'tableHeader', alignment: 'center' },
            { text: '', margin: [0, 10] },
            ...(Array.isArray(dailyReport[day].delinquencies) ? 
                dailyReport[day].delinquencies.map(entry => [entry.unit]) :
                [[dailyReport[day].delinquencies.unit]])
        ];

        docDefinition.content.push(dailyContent);
        docDefinition.content.push({ text: '', pageBreak: 'after' }); // Add page break after each day's report
    });

    // Add overall report to the document content
    const overallContent = [
        {
            columns: [
                {
                    stack: [
                        { text: 'Province of Bukidnon', style: 'header' },
                        { text: 'City of Malaybalay', style: 'header' },
                        { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'header' },
                        { text: 'City Economic Enterprise Development and Management Office', style: 'header' },
                        { text: 'CEEDMO Motorela Booth', style: 'header' }
                    ],
                    alignment: 'center'
                }
            ]
        },
        { text: '', margin: [0, 10] },
        { text: 'Overall Report', style: 'subheader', alignment: 'center' },
        { text: 'Unit', style: 'tableHeader', alignment: 'center' }
    ];

    Object.keys(overallReport).forEach(unit => {
        overallContent.push([unit, overallReport[unit]]);
    });

    docDefinition.content.push(overallContent);

    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(`Motorela Delinquency Report for ${month}-${year}.pdf`);
}
,

generatemonthlyMulticabDelinquenciesReport() {
    const [year, month] = this.monthlyMonth.split('-').map(Number);

    axios.get(`http://127.0.0.1:9000/admin/delinquencies/multicab/monthly?month=${month}&year=${year}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then((response) => {
      const dailyReport = response.data.daily_report;
      const overallReport = response.data.overall_report;
      this.generateMonthlymulticabReports(dailyReport, overallReport, month, year);
    })
    .catch((error) => {
      console.error('Error fetching monthly motorela delinquencies:', error);
    });
},


generateMonthlymulticabReports(dailyReport, overallReport, month, year) {
  const docDefinition = {
        content: [],
        styles: {
            header: {
                fontSize: 16,
                bold: true,
                margin: [0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 5]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        }
    };

    // Sort the dates in ascending order
    const sortedDates = Object.keys(dailyReport).sort((a, b) => new Date(a) - new Date(b));
    console.log('Daily Report for', dailyReport);

    // Add daily reports to the document content
    sortedDates.forEach(day => {
        const dailyContent = [
            {
                columns: [
                    {
                        stack: [
                            { text: 'Province of Bukidnon', style: 'header' },
                            { text: 'City of Malaybalay', style: 'header' },
                            { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'header' },
                            { text: 'City Economic Enterprise Development and Management Office', style: 'header' },
                            { text: 'CEEDMO Multicab Booth', style: 'header' }
                        ],
                        alignment: 'center'
                    }
                ]
            },
            { text: '', margin: [0, 10] },
            { text: `Daily Report   ${year}- ${month} - ${parseInt(day) + 1}`, style: 'subheader', alignment: 'center' },
            { text: '', margin: [0, 10] },
            { text: 'Unit', style: 'tableHeader', alignment: 'center' },
            { text: '', margin: [0, 10] },
            ...(Array.isArray(dailyReport[day].delinquencies) ? 
                dailyReport[day].delinquencies.map(entry => [entry.unit]) :
                [[dailyReport[day].delinquencies.unit]])
        ];

        docDefinition.content.push(dailyContent);
        docDefinition.content.push({ text: '', pageBreak: 'after' }); // Add page break after each day's report
    });

    // Add overall report to the document content
    const overallContent = [
        {
            columns: [
                {
                    stack: [
                        { text: 'Province of Bukidnon', style: 'header' },
                        { text: 'City of Malaybalay', style: 'header' },
                        { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'header' },
                        { text: 'City Economic Enterprise Development and Management Office', style: 'header' },
                        { text: 'CEEDMO Multicab Booth', style: 'header' }
                    ],
                    alignment: 'center'
                }
            ]
        },
        { text: '', margin: [0, 10] },
        { text: 'Overall Report', style: 'subheader', alignment: 'center' },
        { text: 'Unit', style: 'tableHeader', alignment: 'center' }
    ];

    Object.keys(overallReport).forEach(unit => {
        overallContent.push([unit, overallReport[unit]]);
    });

    docDefinition.content.push(overallContent);

    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(`Multicab Delinquency Report for ${month}-${year}.pdf`);
}
,

    generatemonthlyMulticabPaymentReport() {
      const [year, month] = this.monthlyMonth.split('-').map(Number);

      axios.get(`http://127.0.0.1:9000/admin/transactions/payment/multicab/monthly?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
      const dailyReport = response.data.daily_report;
      const overallReport = response.data.overall_report;
      this.generateMonthlymulticabpaymentReports(dailyReport, overallReport, month, year);
        
      })
      .catch((error) => {
        console.error('Error fetching monthly multicab payment transactions:', error);
      });
    },generateMonthlymulticabpaymentReports(dailyReport, overallReport, month, year) {
      const docDefinition = {
        content: [],
        styles: {
            header: { fontSize: 16, bold: true, margin: [0, 10], alignment: 'center' },
            subheader: { fontSize: 14, bold: true, margin: [0, 5], alignment: 'center' },
            tableHeader: { bold: true, fontSize: 13, color: 'black', alignment: 'center' }
        }
    };

    const sortedDates = Object.keys(dailyReport).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(day => {
        const dailyContent = [
            {
                columns: [
                    {
                        stack: [
                            { text: 'Province of Bukidnon', style: 'header' },
                            { text: 'City of Malaybalay', style: 'header' },
                            { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'header' },
                            { text: 'City Economic Enterprise Development and Management Office', style: 'header' },
                            { text: 'CEEDMO Multicab Booth', style: 'header' },
                        ],
                        alignment: 'center'  // Center alignment for the entire stack
                    }
                ]
            },
            { text: '', margin: [0, 10] },
            { text: `Daily Report ${year}-${month}-${parseInt(day) + 1}`, style: 'subheader' },
            { text: '', margin: [0, 10] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: 'Unit', style: 'tableHeader' },
                            { text: 'Amount', style: 'tableHeader' },
                            { text: 'Type', style: 'tableHeader' }
                        ], // Table header row
                        ...dailyReport[day].transactions.map(transaction => [
                            transaction.unit, 
                            transaction.amount.toFixed(2), 
                            transaction.type
                        ]),
                        [
                            { text: 'Total Amount for the Day:', colSpan: 2, bold: true, alignment: 'left' },
                            {},
                            dailyReport[day].transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2)
                        ]
                    ]
                }
            }
        ];

        docDefinition.content.push(dailyContent);
        docDefinition.content.push({ text: '', pageBreak: 'after' }); // Add page break after each day's report
    });

    const totalAmountForMonth = sortedDates.reduce((total, day) => 
        total + dailyReport[day].transactions.reduce((dayTotal, transaction) => dayTotal + transaction.amount, 0), 0
    ).toFixed(2);

    // Generate overall content
    const overallContent = [
        {
            columns: [
                {
                    stack: [
                        { text: 'Province of Bukidnon', style: 'header' },
                        { text: 'City of Malaybalay', style: 'header' },
                        { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'header' },
                        { text: 'City Economic Enterprise Development and Management Office', style: 'header' },
                        { text: 'CEEDMO Multicab Booth', style: 'header' },
                    ],
                    alignment: 'center'  // Center alignment for the entire stack
                }
            ]
        },
        { text: '', margin: [0, 10] },
        { text: `Overall Report ${year}-${month}`, style: 'subheader' },
        {
            table: {
                headerRows: 1,
                widths: ['*', '*'],
                body: [
                    [
                        { text: 'Date', style: 'tableHeader' },
                        { text: 'Total Amount', style: 'tableHeader' }
                    ], // Table header row
                    ...sortedDates.map(day => [
                        parseInt(day) + 1, 
                        dailyReport[day].transactions.reduce((dayTotal, transaction) => dayTotal + transaction.amount, 0).toFixed(2)
                    ]),  
                    ['Total for the Month', totalAmountForMonth]
                ]
            }
        }
    ];

    docDefinition.content.push(overallContent);

    // Generate and download PDF
  
    pdfMake.createPdf(docDefinition).download(`Multicab Payment Report for ${month}-${year}.pdf`);
},   generatemonthlyMotorelaPaymentReport() {
      const [year, month] = this.monthlyMonth.split('-').map(Number);

      axios.get(`http://127.0.0.1:9000/admin/transactions/payment/motorela/monthly?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
      const dailyReport = response.data.daily_report;
      const overallReport = response.data.overall_report;
      this.generateMonthlymotorelapaymentReports(dailyReport, overallReport, month, year);
        
      })
      .catch((error) => {
        console.error('Error fetching monthly motorela payment transactions:', error);
      });
    },generateMonthlymotorelapaymentReports(dailyReport, overallReport, month, year) {
      const docDefinition = {
        content: [],
        styles: {
            header: { fontSize: 16, bold: true, margin: [0, 10], alignment: 'center' },
            subheader: { fontSize: 14, bold: true, margin: [0, 5], alignment: 'center' },
            tableHeader: { bold: true, fontSize: 13, color: 'black', alignment: 'center' }
        }
    };

    const sortedDates = Object.keys(dailyReport).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(day => {
        const dailyContent = [
            {
                columns: [
                    {
                        stack: [
                            { text: 'Province of Bukidnon', style: 'header' },
                            { text: 'City of Malaybalay', style: 'header' },
                            { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'header' },
                            { text: 'City Economic Enterprise Development and Management Office', style: 'header' },
                            { text: 'CEEDMO Motorela Booth', style: 'header' },
                        ],
                        alignment: 'center'  // Center alignment for the entire stack
                    }
                ]
            },
            { text: '', margin: [0, 10] },
            { text: `Daily Report ${year}-${month}-${parseInt(day) + 1}`, style: 'subheader' },
            { text: '', margin: [0, 10] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: 'Unit', style: 'tableHeader' },
                            { text: 'Amount', style: 'tableHeader' },
                            { text: 'Type', style: 'tableHeader' }
                        ], // Table header row
                        ...dailyReport[day].transactions.map(transaction => [
                            transaction.unit, 
                            transaction.amount.toFixed(2), 
                            transaction.type
                        ]),
                        [
                            { text: 'Total Amount for the Day:', colSpan: 2, bold: true, alignment: 'left' },
                            {},
                            dailyReport[day].transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2)
                        ]
                    ]
                }
            }
        ];

        docDefinition.content.push(dailyContent);
        docDefinition.content.push({ text: '', pageBreak: 'after' }); // Add page break after each day's report
    });

    const totalAmountForMonth = sortedDates.reduce((total, day) => 
        total + dailyReport[day].transactions.reduce((dayTotal, transaction) => dayTotal + transaction.amount, 0), 0
    ).toFixed(2);

    // Generate overall content
    const overallContent = [
        {
            columns: [
                {
                    stack: [
                        { text: 'Province of Bukidnon', style: 'header' },
                        { text: 'City of Malaybalay', style: 'header' },
                        { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'header' },
                        { text: 'City Economic Enterprise Development and Management Office', style: 'header' },
                        { text: 'CEEDMO Motorela Booth', style: 'header' },
                    ],
                    alignment: 'center'  // Center alignment for the entire stack
                }
            ]
        },
        { text: '', margin: [0, 10] },
        { text: `Overall Report ${year}-${month}`, style: 'subheader' },
        {
            table: {
                headerRows: 1,
                widths: ['*', '*'],
                body: [
                    [
                        { text: 'Date', style: 'tableHeader' },
                        { text: 'Total Amount', style: 'tableHeader' }
                    ], // Table header row
                    ...sortedDates.map(day => [
                        parseInt(day) + 1, 
                        dailyReport[day].transactions.reduce((dayTotal, transaction) => dayTotal + transaction.amount, 0).toFixed(2)
                    ]),  
                    ['Total for the Month', totalAmountForMonth]
                ]
            }
        }
    ];

    docDefinition.content.push(overallContent);

    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(`Motorela Payment Report for ${month}-${year}.pdf`);
},


  },
};
</script>


