import React, { useState, useEffect } from 'react';
import './Journal.scss'; // Import your CSS file for styling
import NavBar from "../NavBar/NavBar";
import ip from "../ip/ip"


const truncateText = (text, limit) => {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };
  
  const JournalList = ({ journals }) => {
    return (
        <>
        <NavBar clas="dark"/>
      <div className="journal-app-container">
        {journals.map(journal => (
          <div className="journal-card" key={journal.id}>
          <img src={ip() + journal.image} alt={journal.title} className="journal-image" />
           
            <h2 className="journal-title">{truncateText(journal.title, 20)}</h2>
            <p className="journal-description">{truncateText(journal.description, 100)}</p>
            <br />
            <a href={journal.file} target="_blank" rel="noopener noreferrer">
              <button className="journal-button">Purchase PDF</button>
            </a>
          </div>
        ))}
      </div></>
    );
  };
  
  const App = () => {
    const [journalData, setJournalData] = useState([]);
    const apiUrl = 'http://192.168.57.193:3333/journals/';
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `Token ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
  
          const data = await response.json();
          setJournalData(data.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <JournalList journals={journalData} />
      </div>
    );
  };
  
  export default App;
// const JournalList = ({ journals }) => {
//     return (
//       <div className="journal-app-container">
//         {journals.map(journal => (
//           <div className="journal-card" key={journal.id}>
//             <h2 className="journal-title">{journal.title}</h2>
//             <p className="journal-description">{journal.description}</p>
//             <img src={ip() + journal.image} alt={journal.title} className="journal-image" />
//             <br />
//             <a href={journal.file} target="_blank" rel="noopener noreferrer">
//               <button className="journal-button">Purchase PDF</button>
//             </a>
//           </div>
//         ))}
//       </div>
//     );
//   };
  
//   const App = () => {
//     const [journalData, setJournalData] = useState([]);
//     const apiUrl = 'http://192.168.57.193:3333/journals/';
  
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const response = await fetch(apiUrl, {
//             headers: {
//               'Authorization': `Token ${sessionStorage.getItem('token')}`,
//               'Content-Type': 'application/json',
//             },
//           });
  
//           const data = await response.json();
//           setJournalData(data.data);
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         }
//       };
  
//       fetchData();
//     }, []);
  
//     return (
//       <div>
//         <JournalList journals={journalData} />
//       </div>
//     );
//   };
  
//   export default App;
// // const JournalList = ({ journals }) => {
// //   return (
// //     <>
     
// //      <NavBar clas='dark' position='fixed' />

// //     <div>
// //       <h1>Journal List</h1>
// //       {journals.map(journal => (
// //         <div className="journal-card" key={journal.id}>
// //           <h2>{journal.title}</h2>
// //           <p>{journal.description}</p>
// //           <img src={ip() + journal.image} alt={journal.title} />
// //           <br />
// //           <a href={journal.file} target="_blank" rel="noopener noreferrer">
// //             <button className="purchase-button">Purchase PDF</button>
// //           </a>
// //           <hr />
// //         </div>
// //       ))}
// //     </div>
// //     </>
// //   );
// // };

// // const App = () => {
// //   const [journalData, setJournalData] = useState([]);
// //   const apiUrl = 'http://192.168.57.193:3333/journals/';

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await fetch(apiUrl, {
// //           headers: {
// //             'Authorization': `Token ${sessionStorage.getItem('token')}`,
// //             'Content-Type': 'application/json',
// //           },
// //         });

// //         const data = await response.json();
// //         setJournalData(data.data);
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   return (
// //     <div className="app-container">
// //       <JournalList journals={journalData} />
// //     </div>
// //   );
// // };

// // export default App;

