window.addEventListener('DOMContentLoaded', () => {
  // clear cache on reload
  document.getElementById("file-input").value = null;
  
  const
    filenameSpan = document.getElementById("filename-span"),
    fileInput = document.getElementById("file-input")

  fileInput.addEventListener("change", updateDisplay);

  // Defines `updateDisplay`
  function updateDisplay(){
    const filename = fileInput.files[0]?.name;
    filenameSpan.textContent = filename || "(No File Selected)";
    filenameSpan.classList.remove("hidden");
  };
  // modal
  var modal = document.getElementById("uploadModal");
  var btn = document.getElementById("uploadBtn");
  var cancel = document.getElementsByClassName("cancel")[0];

  // clicks the button, open the modal 
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // clicks on <span> (x), close the modal
  cancel.onclick = function() {
    modal.style.display = "none";
  }
  var coll = document.getElementsById("collapsible");
 
    var i;
        for (i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function() {
            this.classList.toggle("active-collapse");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          });
        }
  
        

  // outside of the modal, close it
  window.onclick = function(event) {
    
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  
  var input = document.getElementById( 'file-upload' );
  var infoArea = document.getElementById( 'filename' );

  input.addEventListener( 'change', showFileName );

  function showFileName( event ) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = fileName;
  }
  
  });
  
  const summary_url = 'https://covid-19-albay.herokuapp.com/api/cases_overview';

  async function getData(){
    const response = await fetch(summary_url);
    const overview = await response.json();
    const parsed_overview = JSON.parse(JSON.stringify(overview));

    var updateDate = new Date();
    var updateDate = moment((parsed_overview.last_updated)).format('YYYY-MM-DD');
    

    document.getElementById('totalRecoveries').innerHTML = parsed_overview.recovered;
    document.getElementById('totalDeaths').innerHTML = parsed_overview.died;
    document.getElementById('activeCases').innerHTML = parsed_overview.active;
    document.getElementById('totalCases').innerHTML = parsed_overview.total;
    document.getElementById('updateDate').innerHTML = updateDate;

  }

  const total_url = 'https://covid-19-albay.herokuapp.com/api/history/0';
  async function lineChart(){
    const data = await fetch(total_url);
    const total = await data.json();
    const date = Object.keys(total.cases);
    const new_date = [];
    const new_case = [];
    
    for(var x = 0; x < date.length; x++){
      const first = date[x].split('T');
      new_date.push(first[0]);
    }

    Object.keys(total.cases).forEach((key) => {
      new_case.push(total.cases[key]);
    });

    const parsed_total = JSON.parse(JSON.stringify(total));
    const cty = document.getElementById('overviewChart').getContext('2d');
    const overviewChart = new Chart(cty, {
    type: 'line',
    data: {
      labels: new_date,
      datasets: [{
          label: 'Daily Cases',
          data: new_case,
          backgroundColor: '#001F23',
          borderColor: '#001F23',
          borderWidth: 2,
          tension: 0.2
      }]
    },
    options: {
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
            maxTicksLimit: getTickLimit()
          }}
        
    },
      elements: {
        point:{
            radius: 0
        }
      },
      plugins: {
        legend: {display: false},
        zoom: {
           zoom: {
            wheel: {
              enabled: true,
              speed: 0.1
            },
            pinch:{
              enabled: true,
            },
            mode: 'x'
          },
           pan: {
             enabled: true,
             mode: 'x'
           }
        }  
      }
  }
    });  
    function getTickLimit(){
      return window.innerWidth<576? 4:7
    }  
  }
  

  // async function filterDate(){
  //   const pre_start = new Date(document.getElementById('start').value);
  //   const start = pre_start.setHours(0,0,0,0);
  //   const pre_end = new Date(document.getElementById('end').value);
  //   const end = pre_end.setHours (0,0,0,0);
  //   const filterDates = convertedDates.filter(date => date >= start && date <= end)
  //   console.log(filterDates);
  //   overviewChart.labels = filterDates;
  //   overviewChart.update();

  //   const startArray = convertedDates.index0f(filterDates[0])
  //   console.log(startArray);
  //   const endArray = convertedDates.index0f(filterDates[filterDates. length -1])
  //   console.log(endArray);
  //   const copydatapoints = [...new_case];
  //   console.log(copydatapoints);
  //   copydatapoints.splice(endArray + 1, filterDates. length);
  //   copydatapoints.splice(0, startArray);
  //   overviewChart.data.datasets[0].data = copydatapoints;
  //   overviewChart.update();                    
  // }

  // async function resetDate(){
  //   const data = await fetch(total_url);
  //   const total = await data.json();
  //   const date = Object.keys(total.cases);
  //   const new_date = [];
  //   const new_case = [];
    
  //   for(var x = 0; x < date.length; x++){
  //     const first = date[x].split('T');
  //     new_date.push(first[0]);
  //   }

  //   Object.keys(total.cases).forEach((key) => {
  //     new_case.push(total.cases[key]);
  //   });

  //   const convertedDates = new_date.map(date => new Date(date).setHours(0,0,0,0));
  //   overviewChart.config.data.labels = convertedDates;
  //   overviewChart.config.data.datasets [0].data = new_case;
  //   overviewChart.update();
  //  }

  const dis_url = 'https://covid-19-albay.herokuapp.com/api/cases_detailed';

    async function barChart(){
      const data = await fetch(dis_url);
      const dis = await data.json();
      const parsed_dis = JSON.parse(JSON.stringify(dis));
      const cth = document.getElementById('bar_chart').getContext('2d');
      const bar_chart = new Chart(cth, {
      type: 'bar',
      data: {
      labels: ['0 to 4', '5 to 9', '10 to 14', '15 to 19', '20 to 24', '25 to 29', '30 to 34', '35 to 39', '40 to 44', '45 to 49', '50 to 54', '55 to 59', '60 to 64', '65 to 69', '70 to 74', '75 to 79', '80+'],
      datasets: [{
         label: 'Active Cases',
         backgroundColor: ['#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2'],
         data: [dis['0 to 4']['active'].male + dis['0 to 4']['active'].female,
               dis['5 to 9']['active'].male + dis['5 to 9']['active'].female,
               dis['10 to 14']['active'].male + dis['10 to 14']['active'].female,
               dis['15 to 19']['active'].male + dis['15 to 19']['active'].female,
               dis['20 to 24']['active'].male + dis['20 to 24']['active'].female,
               dis['25 to 29']['active'].male + dis['25 to 29']['active'].female,
               dis['30 to 34']['active'].male + dis['30 to 34']['active'].female,
               dis['35 to 39']['active'].male + dis['35 to 39']['active'].female,
               dis['40 to 44']['active'].male + dis['40 to 44']['active'].female,
               dis['45 to 49']['active'].male + dis['45 to 49']['active'].female,
               dis['50 to 54']['active'].male + dis['50 to 54']['active'].female,
               dis['55 to 59']['active'].male + dis['55 to 59']['active'].female,
               dis['60 to 64']['active'].male + dis['60 to 64']['active'].female,
               dis['65 to 69']['active'].male + dis['65 to 69']['active'].female,
               dis['70 to 74']['active'].male + dis['70 to 74']['active'].female,
               dis['75 to 79']['active'].male + dis['75 to 79']['active'].female,
               dis['80+']['active'].male + dis['80+']['active'].female]
      },{
         label: 'Recovered',
         backgroundColor: ['#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF', '#D4E8CF'],
         data: [dis['0 to 4']['recovered'].male + dis['0 to 4']['recovered'].female,
               dis['5 to 9']['recovered'].male + dis['5 to 9']['recovered'].female,
               dis['10 to 14']['recovered'].male + dis['10 to 14']['recovered'].female,
               dis['15 to 19']['recovered'].male + dis['15 to 19']['recovered'].female,
               dis['20 to 24']['recovered'].male + dis['20 to 24']['recovered'].female,
               dis['25 to 29']['recovered'].male + dis['25 to 29']['recovered'].female,
               dis['30 to 34']['recovered'].male + dis['30 to 34']['recovered'].female,
               dis['35 to 39']['recovered'].male + dis['35 to 39']['recovered'].female,
               dis['40 to 44']['recovered'].male + dis['40 to 44']['recovered'].female,
               dis['45 to 49']['recovered'].male + dis['45 to 49']['recovered'].female,
               dis['50 to 54']['recovered'].male + dis['50 to 54']['recovered'].female,
               dis['55 to 59']['recovered'].male + dis['55 to 59']['recovered'].female,
               dis['60 to 64']['recovered'].male + dis['60 to 64']['recovered'].female,
               dis['65 to 69']['recovered'].male + dis['65 to 69']['recovered'].female,
               dis['70 to 74']['recovered'].male + dis['70 to 74']['recovered'].female,
               dis['75 to 79']['recovered'].male + dis['75 to 79']['recovered'].female,
               dis['80+']['recovered'].male + dis['80+']['recovered'].female]
      },{
         label: 'Died',
         backgroundColor: ['#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4'],
         data: [dis['0 to 4']['died'].male + dis['0 to 4']['died'].female,
               dis['5 to 9']['died'].male + dis['5 to 9']['died'].female,
               dis['10 to 14']['died'].male + dis['10 to 14']['died'].female,
               dis['15 to 19']['died'].male + dis['15 to 19']['died'].female,
               dis['20 to 24']['died'].male + dis['20 to 24']['died'].female,
               dis['25 to 29']['died'].male + dis['25 to 29']['died'].female,
               dis['30 to 34']['died'].male + dis['30 to 34']['died'].female,
               dis['35 to 39']['died'].male + dis['35 to 39']['died'].female,
               dis['40 to 44']['died'].male + dis['40 to 44']['died'].female,
               dis['45 to 49']['died'].male + dis['45 to 49']['died'].female,
               dis['50 to 54']['died'].male + dis['50 to 54']['died'].female,
               dis['55 to 59']['died'].male + dis['55 to 59']['died'].female,
               dis['60 to 64']['died'].male + dis['60 to 64']['died'].female,
               dis['65 to 69']['died'].male + dis['65 to 69']['died'].female,
               dis['70 to 74']['died'].male + dis['70 to 74']['died'].female,
               dis['75 to 79']['died'].male + dis['75 to 79']['died'].female,
               dis['80+']['died'].male + dis['80+']['died'].female]
      }]
      },
      
      options: {
         indexAxis: 'x',
         legend: {display: false},
         title: {
            display: true,
            text: "Cases by Age"
         },
         scales: {
            xAxes: {
              stacked: true,
              ticks: {
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0                
            }},
            barPercentage: 0.2, 
            yAxes: {
              stacked: false
            }
         },
         plugins: {
          zoom: {
             zoom: {
              wheel: {
                enabled: true,
                speed: 0.1
              },
              pinch:{
                enabled: true,
              },
              mode: 'x'
            },
             pan: {
               enabled: true,
               mode: 'x'
             }
          }  
        }
      }
      });
    }
   
    async function doughnutChart(){
      const data = await fetch(dis_url);
      const dis = await data.json();
      const parsed_dis = JSON.parse(JSON.stringify(dis));
      const female = 
        [dis['80+']['active'].male + dis['80+']['recovered'].female + dis['80+']['died'].female,
        dis['75 to 79']['active'].female + dis['75 to 79']['recovered'].female + dis['75 to 79']['died'].female,
        dis['70 to 74']['active'].female + dis['70 to 74']['recovered'].female + dis['70 to 74']['died'].female,
        dis['65 to 69']['active'].female + dis['65 to 69']['recovered'].female + dis['65 to 69']['died'].female,
        dis['60 to 64']['active'].female + dis['60 to 64']['recovered'].female + dis['60 to 64']['died'].female,
        dis['55 to 59']['active'].female + dis['55 to 59']['recovered'].female + dis['55 to 59']['died'].female,
        dis['50 to 54']['active'].female + dis['50 to 54']['recovered'].female + dis['50 to 54']['died'].female,
        dis['45 to 49']['active'].female + dis['45 to 49']['recovered'].female + dis['45 to 49']['died'].female,
        dis['40 to 44']['active'].female + dis['40 to 44']['recovered'].female + dis['40 to 44']['died'].female,
        dis['35 to 39']['active'].female + dis['35 to 39']['recovered'].female + dis['35 to 39']['died'].female,
        dis['30 to 34']['active'].female + dis['30 to 34']['recovered'].female + dis['30 to 34']['died'].female,
        dis['25 to 29']['active'].female + dis['25 to 29']['recovered'].female + dis['25 to 29']['died'].female,
        dis['20 to 24']['active'].female + dis['20 to 24']['recovered'].female + dis['20 to 24']['died'].female,
        dis['15 to 19']['active'].female + dis['15 to 19']['recovered'].female + dis['15 to 19']['died'].female,
        dis['10 to 14']['active'].female + dis['10 to 14']['recovered'].female + dis['10 to 14']['died'].female,
        dis['5 to 9']['active'].female + dis['5 to 9']['recovered'].female + dis['5 to 9']['died'].female,
        dis['0 to 4']['active'].female + dis['0 to 4']['recovered'].female + dis['0 to 4']['died'].female];

      const maleData = 
        [dis['80+']['active'].male + dis['80+']['recovered'].male + dis['80+']['died'].male,
        dis['75 to 79']['active'].male + dis['75 to 79']['recovered'].male + dis['75 to 79']['died'].male,
        dis['70 to 74']['active'].male + dis['70 to 74']['recovered'].male + dis['70 to 74']['died'].male,
        dis['65 to 69']['active'].male + dis['65 to 69']['recovered'].male + dis['65 to 69']['died'].male,
        dis['60 to 64']['active'].male + dis['60 to 64']['recovered'].male + dis['60 to 64']['died'].male,
        dis['55 to 59']['active'].male + dis['55 to 59']['recovered'].male + dis['55 to 59']['died'].male,
        dis['50 to 54']['active'].male + dis['50 to 54']['recovered'].male + dis['50 to 54']['died'].male,
        dis['45 to 49']['active'].male + dis['45 to 49']['recovered'].male + dis['45 to 49']['died'].male,
        dis['40 to 44']['active'].male + dis['40 to 44']['recovered'].male + dis['40 to 44']['died'].male,
        dis['35 to 39']['active'].male + dis['35 to 39']['recovered'].male + dis['35 to 39']['died'].male,
        dis['30 to 34']['active'].male + dis['30 to 34']['recovered'].male + dis['30 to 34']['died'].male,
        dis['25 to 29']['active'].male + dis['25 to 29']['recovered'].male + dis['25 to 29']['died'].male,
        dis['20 to 24']['active'].male + dis['20 to 24']['recovered'].male + dis['20 to 24']['died'].male,
        dis['15 to 19']['active'].male + dis['15 to 19']['recovered'].male + dis['15 to 19']['died'].male,
        dis['10 to 14']['active'].male + dis['10 to 14']['recovered'].male + dis['10 to 14']['died'].male,
        dis['5 to 9']['active'].male + dis['5 to 9']['recovered'].male +  dis['5 to 9']['died'].male,
        dis['0 to 4']['active'].male + dis['0 to 4']['recovered'].male + dis['0 to 4']['died'].male];

      const femaleData = [];
      female.forEach(element => femaleData.push(element * 1))
      const tooltip ={
        yAlign: 'bottom',
        titleAlign: 'center',
        callbacks:{
          labels: function(context){
            console.log(context.raw)
            return `${context.dataset.label} ${Math.abs(context.raw)}`;
          }
        }
      };
      const cth = document.getElementById('pie_chart').getContext('2d');
      const bar_chart = new Chart(cth, {
      type: 'bar',
      data: {
      labels: ['80+', '75 to 79', '70 to 74', '65 to 69', '60 to 64', '55 to 59', '50 to 54', '45 to 49', '40 to 44', '35 to 39', '30 to 34', '25 to 29', '20 to 24', '15 to 19', '10 to 14', '5 to 9', '0 to 4'],
      datasets: [{
        label: 'Female',
        backgroundColor: ['#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4', '#FFDAD4'],
        data: femaleData,
         
      },{
        label: 'Male',
        backgroundColor: ['#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2', '#BDEBF2'],
        data: maleData,
      }],
    },
      options: {
         indexAxis: 'y',
         legend: {display: false},
         title: {
            display: true,
            text: "Cases by Age"
         },
         scales: {
          x: {stacked: true,
            ticks:{
              callback: function(value, index, values){
                console.log(value);
                return Math.abs(value);
              }
            }
          },
          y: {
            beginAtZero: true, 
            stacked: true
          }
       },
       plugins:{
         tooltip,
       },
      }
      });
    }