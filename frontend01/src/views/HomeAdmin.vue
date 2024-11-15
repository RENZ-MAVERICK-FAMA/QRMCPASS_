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
import logos from './base64-logos.json';

// pdfMake.fonts = {
//     Roboto: {
//         normal: 'Roboto-Regular.ttf',
//         bold: 'Roboto-Medium.ttf',
//         italics: 'Roboto-Italic.ttf',
//         bolditalics: 'Roboto-BoldItalic.ttf'
//     }
// };
export default {
  data() {
    return {
      date: '',
      month:'',
      year:'',
      motorelaCount: 0,
      multicabCount: 0,
      availableYears: [],
      selectedYear: new Date().getFullYear(),
  
    };
  },
  mounted() {
    this.fetchUnitCounts();
    this.populateYears();
  },
  methods: {
    getMonthNames() {
    return [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
},
    GenerateOverall(selectedYear) {
      axios.get(`https://qrmcpass.loca.lt/admin/analytics/overall?year=${selectedYear}`)
        .then(response => {
          const data = response.data;
          this.generatePdfFile(data,selectedYear);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    generatePdfFile(data, selectedYear) {
    const totalPaymentsMulticab = data.total_payments_by_type.multicab;
    const totalPaymentsMotorela = data.total_payments_by_type.motorela;
    const totalDelinquenciesMulticab = data.total_delinquencies_by_type.multicab;
    const totalDelinquenciesMotorela = data.total_delinquencies_by_type.motorela;

    const docDefinition = {
        header: (currentPage) => {
            if (currentPage === 1) {
                return { 
                    text: `Annual Report - ${selectedYear} - Total Collection`, 
                    alignment: 'center', 
                    bold: true, 
                    margin: [0, 10, 0, 10] 
                };
            } else if (currentPage === 2) {
                return { 
                    text: `Annual Report - ${selectedYear} - Total Delinquencies`, 
                    alignment: 'center', 
                    bold: true, 
                    margin: [0, 10, 0, 10] 
                };
            }
        },
        content: [
            // Motorela - Total Collection Table
            {
                text: 'Motorela - Total Collection Per Month',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                        [{ text: 'Month', style: 'tableHeader' }, { text: 'Amount Collected', style: 'tableHeader' }],
                        ...getMonthNames().map(month => [
                            month,
                            data.monthly_data[month] && data.monthly_data[month].total_collection.motorela || 0
                        ]),
                        [{ text: 'Total Amount Collected', style: 'tableHeader' }, totalPaymentsMotorela]
                    ]
                },
                margin: [0, 0, 0, 20]
            },

            // Multicab - Total Collection Table
            {
                text: 'Multicab - Total Collection Per Month',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                        [{ text: 'Month', style: 'tableHeader' }, { text: 'Amount Collected', style: 'tableHeader' }],
                        ...getMonthNames().map(month => [
                            month,
                            data.monthly_data[month] && data.monthly_data[month].total_collection.multicab || 0
                        ]),
                        [{ text: 'Total Amount Collected', style: 'tableHeader' }, totalPaymentsMulticab]
                    ]
                },
                margin: [0, 0, 0, 20]
            },
            { text: '', pageBreak: 'after' },

            // Motorela - Total Delinquencies Table
            {
                text: 'Motorela - Total Delinquencies Per Month',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                        [{ text: 'Month', style: 'tableHeader' }, { text: 'Amount Collected', style: 'tableHeader' }],
                        ...getMonthNames().map(month => [
                            month,
                            data.monthly_data[month] && data.monthly_data[month].delinquency_amount.motorela || 0
                        ]),
                        [{ text: 'Total Delinquency Collected', style: 'tableHeader' }, totalDelinquenciesMotorela]
                    ]
                },
                margin: [0, 0, 0, 20]
            },

            // Multicab - Total Delinquencies Table
            {
                text: 'Multicab - Total Delinquencies Per Month',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                        [{ text: 'Month', style: 'tableHeader' }, { text: 'Amount Collected', style: 'tableHeader' }],
                        ...getMonthNames().map(month => [
                            month,
                            data.monthly_data[month] && data.monthly_data[month].delinquency_amount.multicab || 0
                        ]),
                        [{ text: 'Total Delinquency Collected', style: 'tableHeader' }, totalDelinquenciesMulticab]
                    ]
                },
                margin: [0, 0, 0, 20]
            },

            // 14x2 Table for Monthly and Total Amount (with month names)
            {
                text: 'Monthly Report - Total Amount Collected',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                        [{ text: 'Month', style: 'tableHeader' }, { text: 'Amount Collected', style: 'tableHeader' }],
                        ...getMonthNames().map(month => [
                            month,
                            data.monthly_data[month] && data.monthly_data[month].total_collection || 0
                        ]),
                        [{ text: 'Total Amount Collected', style: 'tableHeader' }, totalPaymentsMotorela + totalPaymentsMulticab] // Total of both Motorela and Multicab
                    ]
                },
                margin: [0, 0, 0, 20]
            },

            // Overall Total
            { text: '', margin: [0, 10] },
            { text: 'Overall: ' + (totalPaymentsMotorela + totalPaymentsMulticab), margin: [0, 0, 0, 10], bold: true, alignment: 'center' },

            // Signatories section (aligned to right)
            {
                text: 'Approved by:',
                alignment: 'right',
                margin: [0, 20, 0, 0]
            },
            {
                text: 'Noted by:',
                alignment: 'right'
            }
        ],
        styles: {
            titleText: {
                fontSize: 16,
                bold: true
            },
            sectionHeader: {
                fontSize: 14,
                bold: true
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black',
                alignment: 'center'
            },
            headerText: {
                fontSize: 12,
                bold: true
            }
        }
    };

    const filename = `Annual_Report_${selectedYear}.pdf`;
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
      axios.get('https://qrmcpass.loca.lt/admin/analytics', {
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
  axios.get(`https://qrmcpass.loca.lt/admin/delinquencies/motorela/daily?start_date=${startDate}&end_date=${endDate}`, {
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

    delinquencies.sort((a, b) => new Date(a.date_of_payment) - new Date(b.date_of_payment));

const filename = `Motorela Delinquency Report for ${startDate} & ${endDate}.pdf`;

// Create table body with header row and delinquency data
const tableBody = [
  [
    { text: 'No.', style: 'tableHeader' },
    { text: 'Body Number', style: 'tableHeader' },
    { text: 'Date', style: 'tableHeader' },
    { text: 'Status', style: 'tableHeader' }
  ],
  ...delinquencies.map((delinquency, index) => [
    index + 1, // Sequential number
    delinquency.unit_id || '-',  // Use '-' if unit_id is missing
    new Date(delinquency.date_of_payment).toLocaleDateString('en-US'), // Format date
    delinquency.status || '-' // Use '-' if status is missing
  ])
];

// Updated docDefinition with corrected widths array
const docDefinition = {
  content: [
    {
      columns: [
        { width: 'auto', stack: [{ image: logos.citylogo, width: 40, height: 40, alignment: 'left' }] },
        { width: 'auto', stack: [{ image: logos.ceedmologo, width: 50, height: 40, alignment: 'left' }] },
        {
          width: '*',
          stack: [
            { text: 'Province of Bukidnon', style: 'headerText' },
            { text: 'City Government of Malaybalay', style: 'headerText' },
            { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
            { text: 'CEEDMO Motorela Booth', style: 'headerText' },
            { text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon', style: 'headerText' }
          ],
          alignment: 'center'
        },
        { width: 'auto', stack: [{ image: logos.qrlogo, width: 50, height: 40, alignment: 'right' }] }
      ]
    },
    { text: '', margin: [0, 20] },
    { text: `Today's Report - ${startDate} & ${endDate}`, style: 'subheader', alignment: 'center', margin: [0, 10] },
    {
      table: {
        headerRows: 1,
        widths: [25, 100, 100, 100],  // Updated to match four columns in `tableBody`
        body: tableBody
      }
    },
    { text: '', margin: [0, 15] },
    { text: 'Prepared by:', margin: [0, 30] },
    { text: '', margin: [10, 15] },
    { text: 'Verified by:', margin: [0, 30] },
    { text: '', margin: [0, 15] },
    { text: 'Approved by:', margin: [0, 30] }
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
pdfMake.createPdf(docDefinition).download(filename);
},
generateDelReportMulticabRange(startDate, endDate) {
  axios.get(`https://qrmcpass.loca.lt/admin/delinquencies/multicab/daily?start_date=${startDate}&end_date=${endDate}`, {
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
  const filename = `Multicab Delinquencies Report for ${startDate} & ${endDate}.pdf`;
  

  const tableHeaderRow = ['Body Number', 'Date of Delinquency', 'Status','Date of Payment','Timestamp']; // Plain text values for the header row
  const tableBody = [
  [
    { text: 'No.', style: 'tableHeader' },
    { text: 'Body Number', style: 'tableHeader' },
    { text: 'Date', style: 'tableHeader' },
    { text: 'Status', style: 'tableHeader' }
  ],
  ...delinquencies.map((delinquency, index) => [
    index + 1, // Sequential number
    delinquency.unit_id || '-',  // Use '-' if unit_id is missing
    new Date(delinquency.date_of_payment).toLocaleDateString('en-US'), // Format date
    delinquency.status || '-' // Use '-' if status is missing
  ])
];

  const docDefinition = {
    content: [
      {
        columns: [
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.citylogo,
                width: 40,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.ceedmologo,
                width: 50,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: '*', // Takes up remaining space
        stack: [
            {
                text: 'Province of Bukidnon',
                style: 'headerText'
            },
            {
                text: 'City Government of Malaybalay',
                style: 'headerText'
            },
            {
                text: 'City Economic Enterprise Development and Management Office',
                style: 'headerText'
            },
            {
                text: 'CEEDMO Multicab Booth',
                style: 'headerText'
            },
            {
                text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon',
                style: 'headerText'
            }
        ],
        alignment: 'center' // Center the header text
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.qrlogo,
                width: 50,
                height: 40,
                alignment: 'right'
            }
        ]
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
  axios.get(`https://qrmcpass.loca.lt/admin/transactions/payment/multicab/daily?start_date=${startDate}&end_date=${endDate}`, {
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
  const filename = `Multicab Payment Report for ${startDate} & ${endDate}.pdf`;

  const docDefinition = {
    content: [
      {
        columns: [
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.citylogo,
                width: 40,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.ceedmologo,
                width: 50,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: '*', // Takes up remaining space
        stack: [
            {
                text: 'Province of Bukidnon',
                style: 'headerText'
            },
            {
                text: 'City Government of Malaybalay',
                style: 'headerText'
            },
            {
                text: 'City Economic Enterprise Development and Management Office',
                style: 'headerText'
            },
            {
                text: 'CEEDMO Multicab Booth',
                style: 'headerText'
            },
            {
                text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon',
                style: 'headerText'
            }
        ],
        alignment: 'center' // Center the header text
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.qrlogo,
                width: 50,
                height: 40,
                alignment: 'right'
            }
        ]
    }
]
      },
      { text: '', margin: [0, 20] },  // Space below the header
      { text: `Today's Report - ${startDate} & ${endDate}`, style: 'subheader', alignment: 'center', margin: [0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto'],
          body: [
            [{ text: 'Body Number', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Amount', style: 'tableHeader' }, { text: 'Type', style: 'tableHeader' }],
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
  axios.get(`https://qrmcpass.loca.lt/admin/transactions/payment/motorela/daily?start_date=${startDate}&end_date=${endDate}`, {
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
  const filename = `Motorela Payment Report for ${startDate} & ${endDate}.pdf`;

  const docDefinition = {
    content: [
      {
        columns: [
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.citylogo,
                width: 40,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.ceedmologo,
                width: 50,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: '*', // Takes up remaining space
        stack: [
            {
                text: 'Province of Bukidnon',
                style: 'headerText'
            },
            {
                text: 'City Government of Malaybalay',
                style: 'headerText'
            },
            {
                text: 'City Economic Enterprise Development and Management Office',
                style: 'headerText'
            },
            {
                text: 'CEEDMO Motorela Booth',
                style: 'headerText'
            },
            {
                text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon',
                style: 'headerText'
            }
        ],
        alignment: 'center' // Center the header text
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.qrlogo,
                width: 50,
                height: 40,
                alignment: 'right'
            }
        ]
    }
]
      },
      { text: '', margin: [0, 20] },  // Space below the header
      { text: `Today's Report ${startDate} & ${endDate}`, style: 'subheader', alignment: 'center', margin: [0, 10] },
      {
        table: {
  headerRows: 1,
  widths: ['auto', 'auto', 'auto', 'auto', 'auto'], // Add an additional 'auto' for the new 'No.' column
  body: [
    [
      { text: 'No.', style: 'tableHeader' },  // New header for the 'No.' column
      { text: 'Body Number', style: 'tableHeader' },
      { text: 'Date', style: 'tableHeader' },
      { text: 'Amount', style: 'tableHeader' },
      { text: 'Type', style: 'tableHeader' }
    ],
    ...transactions.map((transaction, index) => [
      index + 1,  // Add index + 1 to represent the row number (1-based)
      transaction.id, 
      new Date(transaction.date).toLocaleDateString('en-US'), // Convert date to readable format
      transaction.amount.toFixed(2), 
      transaction.type
    ]),
    [{ text: 'Total:', colSpan: 3, bold: true, alignment: 'right' }, {}, {}, totalAmount.toFixed(2), '']
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
generatemonthlyMotorelaDelinquenciesReport() {
    const [year, month] = this.monthlyMonth.split('-').map(Number);

    axios.get(`https://qrmcpass.loca.lt/admin/delinquencies/motorela/monthly?month=${month}&year=${year}`, {
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
    // Helper to get month name from month number
    const getMonthName = (month) => new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    // Calculate number of days in the specified month and year
    const daysInMonth = new Date(year, month, 0).getDate();

    const docDefinition = {
        content: [],
        styles: {
            header: { fontSize: 16, bold: true, margin: [0, 10] },
            subheader: { fontSize: 14, bold: true, margin: [0, 5] },
            tableHeader: { bold: true, fontSize: 13, color: 'black' },
            headerText: { fontSize: 12, bold: true }
        }
    };

    // Sort dates in ascending order
    const sortedDates = Object.keys(dailyReport).sort((a, b) => new Date(a) - new Date(b));

    // Add daily reports
    sortedDates.forEach(day => {
        const dailyContent = [
            {
                columns: [
                    {
                        stack: [
                            { text: 'Province of Bukidnon', style: 'headerText' },
                            { text: 'City of Malaybalay', style: 'headerText' },
                            { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'headerText' },
                            { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
                            { text: 'CEEDMO Motorela Booth', style: 'headerText' }
                        ],
                        alignment: 'center'
                    }
                ]
            },
            { text: '', margin: [0, 10] },
            { text: `Daily Report for ${getMonthName(month)}-${parseInt(day) + 1}-${year}`, style: 'subheader', alignment: 'center' },
            { text: '', margin: [0, 10] },
            {
                table: {
                    widths: [25, '*', '*', '*'],
                    body: [
                        [
                            { text: 'No.', style: 'tableHeader', alignment: 'center' },
                            { text: 'Body Number', style: 'tableHeader', alignment: 'center' },
                            { text: 'Date of Delinquency', style: 'tableHeader', alignment: 'center' },
                            { text: 'Amount', style: 'tableHeader', alignment: 'center' }
                        ],
                        ...(Array.isArray(dailyReport[day].delinquencies) 
                            ? dailyReport[day].delinquencies.map((entry, index) => [
                                { text: index + 1, alignment: 'center' },
                                entry.unit || '-', 
                                entry.date || '-', 
                                (entry.amount ? entry.amount * 6 : 6).toFixed(2)
                              ])
                            : [[1, dailyReport[day].delinquencies.unit || '-', dailyReport[day].delinquencies.date || '-', (dailyReport[day].delinquencies.amount ? dailyReport[day].delinquencies.amount * 6 : 6).toFixed(2)]]
                        ),
                        [
                            { text: '', colSpan: 3, border: [false, true, false, false] },
                            {}, {}, 
                            { 
                                text: `Total: ${
                                    Array.isArray(dailyReport[day].delinquencies) 
                                    ? dailyReport[day].delinquencies.reduce((sum, entry) => sum + (entry.amount ? entry.amount * 6 : 6), 0) 
                                    : (dailyReport[day].delinquencies.amount ? dailyReport[day].delinquencies.amount * 6 : 6)
                                }`,
                                alignment: 'center',
                                bold: true
                            }
                        ]
                    ]
                }
            },
            { text: '', margin: [0, 10] }
        ];

        docDefinition.content.push(dailyContent);
        docDefinition.content.push({ text: '', pageBreak: 'after' });
    });

    const overallContent = [
    {
        columns: [
            { width: 'auto', stack: [{ image: logos.citylogo, width: 40, height: 40, alignment: 'left' }] },
            { width: 'auto', stack: [{ image: logos.ceedmologo, width: 50, height: 40, alignment: 'left' }] },
            {
                width: '*',
                stack: [
                    { text: 'Province of Bukidnon', style: 'headerText' },
                    { text: 'City Government of Malaybalay', style: 'headerText' },
                    { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
                    { text: 'CEEDMO Motorela Booth', style: 'headerText' },
                    { text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon', style: 'headerText' }
                ],
                alignment: 'center'
            },
            { width: 'auto', stack: [{ image: logos.qrlogo, width: 50, height: 40, alignment: 'right' }] }
        ]
    },
    { text: '', margin: [0, 10] },
    { text: `Overall Report for the month of ${getMonthName(month)}-${year}`, style: 'subheader' },
    {
        table: {
            headerRows: 1,
            widths: [25, '*', '*', '*'],
            body: [
                [
                    { text: 'No.', style: 'tableHeader', alignment: 'center' },
                    { text: 'Date of Delinquency', style: 'tableHeader', alignment: 'center' },
                    { text: 'Number of Delinquencies', style: 'tableHeader', alignment: 'center' },
                    { text: 'Total Amount', style: 'tableHeader', alignment: 'center' }
                ],
                // Loop through each day to calculate the delinquencies and total amount for each date
                ...Object.keys(dailyReport).map(day => {
                    const dailyData = dailyReport[day];  // Get the daily report data for the day
                    const delinquencyCount = dailyData.delinquencies.length;  // Count the delinquencies for the day
                    const totalAmount = delinquencyCount * 6;  // Total amount for the day (assuming 6 per delinquency)

                    // Return an array with formatted data for each row in the table
                    return [
                        { text: parseInt(day) + 1, alignment: 'center' },  // Day (1-based index)
                        parseInt(day)+1,  // Date (formatted as YYYY-MM-DD)
                        { text: delinquencyCount, alignment: 'center' },  // Number of delinquencies
                        { text: totalAmount.toFixed(2), alignment: 'center' }  // Total amount for the day
                    ];
                }),
                // Calculate total delinquency for the month
                [
                    { text: 'Total for the Month', colSpan: 3, alignment: 'center', bold: true },
                    {}, {},
                    { 
                        text: Object.keys(dailyReport).reduce((sum, day) => {
                            const dailyData = dailyReport[day];
                            const delinquencyCount = dailyData.delinquencies.length;
                            return sum + (delinquencyCount * 6);  // Add up the delinquency totals for the month
                        }, 0).toFixed(2),
                        alignment: 'center', bold: true 
                    }
                ]
            ]
        }
    },
    { text: '', margin: [0, 15] },
    { text: 'Prepared by:', style: 'headerText', alignment: 'right' },
    { text: '', margin: [0, 15] },
    { text: 'Admin', style: 'headerText', alignment: 'right' },
    { text: '', margin: [0, 15] },
    { text: 'Approved by:', style: 'headerText', alignment: 'right' },
    { text: '', margin: [0, 15] },
    { text: 'Division Head', style: 'headerText', alignment: 'right' }
];

// Add the overall content to the document
docDefinition.content.push(overallContent);

    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(`Motorela Delinquency Report for ${getMonthName(month)}-${year}.pdf`);
}
,



generatemonthlyMulticabDelinquenciesReport() {
    const [year, month] = this.monthlyMonth.split('-').map(Number);

    axios.get(`https://qrmcpass.loca.lt/admin/delinquencies/multicab/monthly?month=${month}&year=${year}`, {
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
      console.error('Error fetching monthly multicab delinquencies:', error);
    });
},


generateMonthlymulticabReports(dailyReport, overallReport, month, year) {
    // Helper to get month name from month number
    const getMonthName = (month) => new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    // Calculate number of days in the specified month and year
    const daysInMonth = new Date(year, month, 0).getDate();

    const docDefinition = {
        content: [],
        styles: {
            header: { fontSize: 16, bold: true, margin: [0, 10] },
            subheader: { fontSize: 14, bold: true, margin: [0, 5] },
            tableHeader: { bold: true, fontSize: 13, color: 'black' },
            headerText: { fontSize: 12, bold: true }
        }
    };

    // Sort dates in ascending order
    const sortedDates = Object.keys(dailyReport).sort((a, b) => new Date(a) - new Date(b));

    // Add daily reports
    sortedDates.forEach(day => {
        const dailyContent = [
            {
                columns: [
                    {
                        stack: [
                            { text: 'Province of Bukidnon', style: 'headerText' },
                            { text: 'City of Malaybalay', style: 'headerText' },
                            { text: 'Market Site Brgy 9, Malaybalay City Bukidnon', style: 'headerText' },
                            { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
                            { text: 'CEEDMO Multicab Booth', style: 'headerText' }
                        ],
                        alignment: 'center'
                    }
                ]
            },
            { text: '', margin: [0, 10] },
            { text: `Daily Report for ${getMonthName(month)}-${parseInt(day) + 1}-${year}`, style: 'subheader', alignment: 'center' },
            { text: '', margin: [0, 10] },
            {
                table: {
                    widths: [25, '*', '*', '*'],
                    body: [
                        [
                            { text: 'No.', style: 'tableHeader', alignment: 'center' },
                            { text: 'Body Number', style: 'tableHeader', alignment: 'center' },
                            { text: 'Date of Delinquency', style: 'tableHeader', alignment: 'center' },
                            { text: 'Amount', style: 'tableHeader', alignment: 'center' }
                        ],
                        ...(Array.isArray(dailyReport[day].delinquencies) 
                            ? dailyReport[day].delinquencies.map((entry, index) => [
                                { text: index + 1, alignment: 'center' },
                                entry.unit || '-', 
                                entry.date || '-', 
                                (entry.amount ? entry.amount * 11 : 11).toFixed(2)
                              ])
                            : [[1, dailyReport[day].delinquencies.unit || '-', dailyReport[day].delinquencies.date || '-', (dailyReport[day].delinquencies.amount ? dailyReport[day].delinquencies.amount * 6 : 6).toFixed(2)]]
                        ),
                        [
                            { text: '', colSpan: 3, border: [false, true, false, false] },
                            {}, {}, 
                            { 
                                text: `Total: ${
                                    Array.isArray(dailyReport[day].delinquencies) 
                                    ? dailyReport[day].delinquencies.reduce((sum, entry) => sum + (entry.amount ? entry.amount * 11 : 11), 0) 
                                    : (dailyReport[day].delinquencies.amount ? dailyReport[day].delinquencies.amount * 11 : 11)
                                }`,
                                alignment: 'center',
                                bold: true
                            }
                        ]
                    ]
                }
            },
            { text: '', margin: [0, 10] }
        ];

        docDefinition.content.push(dailyContent);
        docDefinition.content.push({ text: '', pageBreak: 'after' });
    });

    const overallContent = [
    {
        columns: [
            { width: 'auto', stack: [{ image: logos.citylogo, width: 40, height: 40, alignment: 'left' }] },
            { width: 'auto', stack: [{ image: logos.ceedmologo, width: 50, height: 40, alignment: 'left' }] },
            {
                width: '*',
                stack: [
                    { text: 'Province of Bukidnon', style: 'headerText' },
                    { text: 'City Government of Malaybalay', style: 'headerText' },
                    { text: 'City Economic Enterprise Development and Management Office', style: 'headerText' },
                    { text: 'CEEDMO Multicab Booth', style: 'headerText' },
                    { text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon', style: 'headerText' }
                ],
                alignment: 'center'
            },
            { width: 'auto', stack: [{ image: logos.qrlogo, width: 50, height: 40, alignment: 'right' }] }
        ]
    },
    { text: '', margin: [0, 10] },
    { text: `Overall Report for the month of ${getMonthName(month)}-${year}`, style: 'subheader' },
    {
        table: {
            headerRows: 1,
            widths: [25, '*', '*', '*'],
            body: [
                [
                    { text: 'No.', style: 'tableHeader', alignment: 'center' },
                    { text: 'Date of Delinquency', style: 'tableHeader', alignment: 'center' },
                    { text: 'Number of Delinquencies', style: 'tableHeader', alignment: 'center' },
                    { text: 'Total Amount', style: 'tableHeader', alignment: 'center' }
                ],
                // Loop through each day to calculate the delinquencies and total amount for each date
                ...Object.keys(dailyReport).map(day => {
                    const dailyData = dailyReport[day];  // Get the daily report data for the day
                    const delinquencyCount = dailyData.delinquencies.length;  // Count the delinquencies for the day
                    const totalAmount = delinquencyCount * 11;  // Total amount for the day (assuming 6 per delinquency)

                    // Return an array with formatted data for each row in the table
                    return [
                        { text: parseInt(day) + 1, alignment: 'center' },  // Day (1-based index)
                        parseInt(day)+1,  // Date (formatted as YYYY-MM-DD)
                        { text: delinquencyCount, alignment: 'center' },  // Number of delinquencies
                        { text: totalAmount.toFixed(2), alignment: 'center' }  // Total amount for the day
                    ];
                }),
                // Calculate total delinquency for the month
                [
                    { text: 'Total for the Month', colSpan: 3, alignment: 'center', bold: true },
                    {}, {},
                    { 
                        text: Object.keys(dailyReport).reduce((sum, day) => {
                            const dailyData = dailyReport[day];
                            const delinquencyCount = dailyData.delinquencies.length;
                            return sum + (delinquencyCount * 11);  // Add up the delinquency totals for the month
                        }, 0).toFixed(2),
                        alignment: 'center', bold: true 
                    }
                ]
            ]
        }
    },
    { text: '', margin: [0, 15] },
    { text: 'Prepared by:', style: 'headerText', alignment: 'right' },
    { text: '', margin: [0, 15] },
    { text: 'Admin', style: 'headerText', alignment: 'right' },
    { text: '', margin: [0, 15] },
    { text: 'Approved by:', style: 'headerText', alignment: 'right' },
    { text: '', margin: [0, 15] },
    { text: 'Division Head', style: 'headerText', alignment: 'right' }
];

// Add the overall content to the document
docDefinition.content.push(overallContent);

    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(`Multicab Delinquency Report for ${this.getMonthName(month)}-${year}.pdf`);
}
,

    generatemonthlyMulticabPaymentReport() {
      const [year, month] = this.monthlyMonth.split('-').map(Number);

      axios.get(`https://qrmcpass.loca.lt/admin/transactions/payment/multicab/monthly?month=${month}&year=${year}`, {
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
    },
    generateMonthlymulticabpaymentReports(dailyReport, overallReport, month, year) {
        const docDefinition = {
        content: [],
        styles: {
            header: { fontSize: 16, bold: true, margin: [0, 10], alignment: 'center' },
            subheader: { fontSize: 14, bold: true, margin: [0, 5], alignment: 'center' },
            tableHeader: { bold: true, fontSize: 13, color: 'black', alignment: 'center' },
            headerText: {fontSize: 10,bold: true},
        }
    }; 

    const sortedDates = Object.keys(dailyReport).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(day => {
        const dailyContent = [
            {
              columns: [
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.citylogo,
                width: 40,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.ceedmologo,
                width: 50,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: '*', // Takes up remaining space
        stack: [
            {
                text: 'Province of Bukidnon',
                style: 'headerText'
            },
            {
                text: 'City Government of Malaybalay',
                style: 'headerText'
            },
            {
                text: 'City Economic Enterprise Development and Management Office',
                style: 'headerText'
            },
            {
                text: 'CEEDMO Multicab Booth',
                style: 'headerText'
            },
            {
                text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon',
                style: 'headerText'
            }
        ],
        alignment: 'center' // Center the header text
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.qrlogo,
                width: 50,
                height: 40,
                alignment: 'right'
            }
        ]
    }
]
            },
            { text: '', margin: [0, 10] },
            { text: `Daily Report for ${this.getMonthName(month)}-${parseInt(day) + 1}-${year}`, style: 'subheader' },
            { text: '', margin: [0, 10] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [
                        [    { text: 'No.', style: 'tableHeader' },
                            { text: 'Body Number', style: 'tableHeader' },
                            { text: 'Amount', style: 'tableHeader' },
                            { text: 'Type', style: 'tableHeader' }
                        ], // Table header row
                        ...dailyReport[day].transactions.map(transaction => [
                        { text: index + 1, alignment: 'center' },
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
                width: 'auto', // Automatically size based on content
                stack: [
                    {
                        image: logos.citylogo,
                        width: 40,
                        height: 40,
                        alignment: 'left'
                    }
                ]
            },
            {
                width: 'auto', // Automatically size based on content
                stack: [
                    {
                        image: logos.ceedmologo,
                        width: 50,
                        height: 40,
                        alignment: 'left'
                    }
                ]
            },
            {
                width: '*', // Takes up remaining space
                stack: [
                    {
                        text: 'Province of Bukidnon',
                        style: 'headerText'
                    },
                    {
                        text: 'City Government of Malaybalay',
                        style: 'headerText'
                    },
                    {
                        text: 'City Economic Enterprise Development and Management Office',
                        style: 'headerText'
                    },
                    {
                        text: 'CEEDMO Multicab Booth',
                        style: 'headerText'
                    },
                    {
                        text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon',
                        style: 'headerText'
                    }
                ],
                alignment: 'center' // Center the header text
            },
            {
                width: 'auto', // Automatically size based on content
                stack: [
                    {
                        image: logos.qrlogo,
                        width: 50,
                        height: 40,
                        alignment: 'right'
                    }
                ]
            }
        ]
    },
    { text: '', margin: [0, 10] },
    { text: `Overall Report for the month of ${this.getMonthName(month)}-${year}`, style: 'subheader' },
    {
        table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
                [
                    { text: 'No.', style: 'tableHeader' },
                    { text: 'Date', style: 'tableHeader' },
                    { text: 'Total Amount', style: 'tableHeader' }
                ], // Table header row
                ...sortedDates.map(day => [
                { text: index + 1, alignment: 'center' },
                    parseInt(day) + 1, 
                    dailyReport[day].transactions.reduce((dayTotal, transaction) => dayTotal + transaction.amount, 0).toFixed(2)
                ]),  
                ['Total for the Month', totalAmountForMonth]
            ]
        }
    },
    { text: '', margin: [0, 15] }, // Add some space before the signatory section
    {
        text: 'Prepared by:', style: 'headerText', alignment: 'right'
    },
    { text: '', margin: [0, 15] },
    {
        text: 'Admin', style: 'headerText', alignment: 'right'
    },
    { text: '', margin: [0, 15] }, // Small space between Prepared and Approved
    {
        text: 'Approved by:', style: 'headerText', alignment: 'right'
    },
    { text: '', margin: [0, 15] },
    {
        text: 'Division Head', style: 'headerText', alignment: 'right'
    }
];

    docDefinition.content.push(overallContent);

    // Generate and download PDF
  
    pdfMake.createPdf(docDefinition).download(`Multicab Payment Report for ${this.getMonthName(month)}-${year}.pdf`);
},  
 generatemonthlyMotorelaPaymentReport() {
      const [year, month] = this.monthlyMonth.split('-').map(Number);

      axios.get(`https://qrmcpass.loca.lt/admin/transactions/payment/motorela/monthly?month=${month}&year=${year}`, {
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
    },
    generateMonthlymotorelapaymentReports(dailyReport, overallReport, month, year) {
      const docDefinition = {
        content: [],
        styles: {
            header: { fontSize: 16, bold: true, margin: [0, 10], alignment: 'center' },
            subheader: { fontSize: 14, bold: true, margin: [0, 5], alignment: 'center' },
            tableHeader: { bold: true, fontSize: 13, color: 'black', alignment: 'center' },
            headerText: {fontSize: 10,bold: true},
        }
    }; 

    const sortedDates = Object.keys(dailyReport).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(day => {
        const dailyContent = [
            {
              columns: [
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.citylogo,
                width: 40,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.ceedmologo,
                width: 50,
                height: 40,
                alignment: 'left'
            }
        ]
    },
    {
        width: '*', // Takes up remaining space
        stack: [
            {
                text: 'Province of Bukidnon',
                style: 'headerText'
            },
            {
                text: 'City Government of Malaybalay',
                style: 'headerText'
            },
            {
                text: 'City Economic Enterprise Development and Management Office',
                style: 'headerText'
            },
            {
                text: 'CEEDMO Motorela Booth',
                style: 'headerText'
            },
            {
                text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon',
                style: 'headerText'
            }
        ],
        alignment: 'center' // Center the header text
    },
    {
        width: 'auto', // Automatically size based on content
        stack: [
            {
                image: logos.qrlogo,
                width: 50,
                height: 40,
                alignment: 'right'
            }
        ]
    }
]
            },
            { text: '', margin: [0, 10] },
            { text: `Daily Report for ${this.getMonthName(month)}-${parseInt(day) + 1}-${year}`, style: 'subheader' },
            { text: '', margin: [0, 10] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [
                        [       
                         { text: 'No.', style: 'tableHeader' },
                            { text: 'Body Number', style: 'tableHeader' },
                            { text: 'Amount', style: 'tableHeader' },
                            { text: 'Type', style: 'tableHeader' }
                        ], // Table header row
                        ...dailyReport[day].transactions.map(transaction => [
                        { text: index + 1, alignment: 'center' },
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
                width: 'auto', // Automatically size based on content
                stack: [
                    {
                        image: logos.citylogo,
                        width: 40,
                        height: 40,
                        alignment: 'left'
                    }
                ]
            },
            {
                width: 'auto', // Automatically size based on content
                stack: [
                    {
                        image: logos.ceedmologo,
                        width: 50,
                        height: 40,
                        alignment: 'left'
                    }
                ]
            },
            {
                width: '*', // Takes up remaining space
                stack: [
                    {
                        text: 'Province of Bukidnon',
                        style: 'headerText'
                    },
                    {
                        text: 'City Government of Malaybalay',
                        style: 'headerText'
                    },
                    {
                        text: 'City Economic Enterprise Development and Management Office',
                        style: 'headerText'
                    },
                    {
                        text: 'CEEDMO Motorela Booth',
                        style: 'headerText'
                    },
                    {
                        text: 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon',
                        style: 'headerText'
                    }
                ],
                alignment: 'center' // Center the header text
            },
            {
                width: 'auto', // Automatically size based on content
                stack: [
                    {
                        image: logos.qrlogo,
                        width: 50,
                        height: 40,
                        alignment: 'right'
                    }
                ]
            }
        ]
    },
    { text: '', margin: [0, 10] },
    { text: `Overall Report for the month of ${this.getMonthName(month)}-${year}`, style: 'subheader' },
    {
        table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
                [
                    { text: 'No.', style: 'tableHeader' },
                    { text: 'Date', style: 'tableHeader' },
                    { text: 'Total Amount', style: 'tableHeader' }
                ], 
                { text: index + 1, alignment: 'center' },
                ...sortedDates.map(day => [
                    parseInt(day) + 1, 
                    dailyReport[day].transactions.reduce((dayTotal, transaction) => dayTotal + transaction.amount, 0).toFixed(2)
                ]),  
                ['Total for the Month', totalAmountForMonth]
            ]
        }
    },
    { text: '', margin: [0, 15] }, // Add some space before the signatory section
    {
        text: 'Prepared by:', style: 'headerText', alignment: 'right'
    },
    { text: '', margin: [0, 15] },
    {
        text: 'Admin', style: 'headerText', alignment: 'right'
    },
    { text: '', margin: [0, 15] }, // Small space between Prepared and Approved
    {
        text: 'Approved by:', style: 'headerText', alignment: 'right'
    },
    { text: '', margin: [0, 15] },
    {
        text: 'Division Head', style: 'headerText', alignment: 'right'
    }
];

    docDefinition.content.push(overallContent);

    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(`Motorela Payment Report for ${this.getMonthName(month)}-${year}.pdf`);
},


  }
};
</script>


