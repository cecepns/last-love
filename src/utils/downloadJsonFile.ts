import moment from 'moment';

export const downloadJson = (data: unknown, fileName = 'users') => {
  try {
    const jsonString = JSON.stringify(data);

    const blob = new Blob([jsonString], { type: 'application/json' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}-data-${moment().format('DD-MM-YYYY HH:mm')}.json`;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
  } catch (error) {
    console.log('Failed download json', error);
    alert('Failed Downdload Json File');
  }
};
