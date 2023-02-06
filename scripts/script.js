// /* eslint-disable no-unused-expressions */
// // eslint-disable-next-line max-classes-per-file
// class Bookshelf {
//   constructor() {
//     // Property
//     this.id = +new Date();

//     this.title = document.querySelector('#inputJudul').value;
//     this.author = document.querySelector('#inputPenulis').value;
//     this.year = Number(document.querySelector('#inputTahun').value);
//     this.isComplete = this.pilihChecklist;

//     this.bisaStorage = typeof (Storage) !== 'undefined';

//     this.kunciS = 'RdBooks';

//     this.qSelector = (elemen) => document.querySelector(elemen);
//     this.qSelectAll = (elemen) => document.querySelectorAll(elemen);
//   }

//   // Method hapus form
//   clearForm() {
//     const x = document.querySelectorAll('.input');
//     for (let i = 0; i < x.length; i += 1) {
//       x[i].value = '';
//     }
//   }

// Method kondisi centang checklist
// }
// =================================================================

// let books = [];

// const rdBooks = (event) => {
//   event.preventDefault();

//   const inputJudul = document.getElementById('inputJudul');

// };

// Menampilkan Isi Form ke dokumen web
// const submitAction = document.getElementById('formTambah');

// submitAction.addEventListener('submit', (event) => {
//   const inputTitle = document.getElementById('inputJudul').value;
//   const inputAuthor = document.getElementById('inputPenulis').value;
//   const inputYear = document.getElementById('inputTahun').value;

//   const hiddenMessage = document.createElement('p');
//   hiddenMessage.innerHTML = `Judul: ${inputTitle}, Penulis: ${inputAuthor}, Tahun: ${inputYear}`;
//   document.getElementById('formTambah').append(hiddenMessage);

//   event.preventDefault();
// });

// Event pada form input
document.addEventListener('DOMContentLoaded', () => {
  // Input judul dan elemen teks sisa karakter
  const on = document.querySelectorAll('#inputJudul, #inputPenulis, #inputTahun');
  const sisaKarakter = document.querySelectorAll('#sisaKarakterJudul, #sisaKarakterPenulis, #sisaKarakterTahun');
  const tombolTambah = document.getElementById('tombolTambah');
  const formTambah = document.getElementById('formTambah');

  // Perulangan event listener input
  for (let i = 0; i < on.length; i += 1) {
    sisaKarakter[i].innerText = `Sisa karakter: ${on[i].maxLength}`;
    // onInput
    on[i].addEventListener('input', () => {
      const sisaKarakterUpdate = on[i].maxLength - on[i].value.length;
      sisaKarakter[i].innerText = `Sisa karakter: ${sisaKarakterUpdate.toString()}`;

      if (sisaKarakterUpdate === 0) {
        sisaKarakter[i].innerText = 'Batas capai terpenuhi!';
        sisaKarakter[i].style.color = 'red';
        // ==================================================
      } else if (sisaKarakterUpdate <= 5) {
        sisaKarakter[i].style.color = 'orange';
        // ==================================================
      } else {
        sisaKarakter[i].style.color = 'white';
      }

      if ((on[2].value.length === 4) && (on[0].value.length && on[1].value.length !== 0)) {
        tombolTambah.removeAttribute('disabled');
      } else {
        tombolTambah.setAttribute('disabled', '');
      }
    });

    // onBlur
    on[i].addEventListener('blur', () => {
      sisaKarakter[i].style.visibility = 'hidden';
    });

    // onFocus
    on[i].addEventListener('focus', () => {
      sisaKarakter[i].style.visibility = 'visible';
    });

    // onChange
    // formTambah.addEventListener('submit', () => {
    //   on[i].value = null;
    // });
  }

  document.getElementById('cekBelum').checked = true;
  document.getElementById('cekSelesai').checked = false;

  const cekBelum = document.getElementById('cekBelum');
  const cekSelesai = document.getElementById('cekSelesai');

  const cek = () => {
    document.getElementById('cekBelum').addEventListener('change', () => {
      if (cekBelum.checked) {
        document.getElementById('cekSelesai').checked = false;
      }
    });

    document.getElementById('cekSelesai').addEventListener('change', () => {
      if (cekSelesai.checked) {
        document.getElementById('cekBelum').checked = false;
      }
    });
  };

  cek();

  // OnChange
  // document.getElementById('inputTahun').addEventListener('change', () => {
  //   console.log('Tombol aktif');

  //   const inputTahun = document.getElementById('inputTahun').value;
  //   const tombolTambah = document.getElementById('tombolTambah');

  //   if (inputTahun.length === 4) {
  //     tombolTambah.removeAttribute('disabled');
  //   } else {
  //     tombolTambah.setAttribute('disabled', '');
  //   }
  // });

  // document.getElementById('formTambah').addEventListener('submit', (event) => {
  //   const inputTahun = document.getElementById('inputTahun').value;

  //   if (inputTahun.length === 4) {
  //     alert('Tombol aktif!');
  //   } else {
  //     alert('Panjang input tahun tidak terpenuhi');
  //     document.getElementById('tombolTambah').setAttribute('disabled', '');
  //   }

  //   event.preventDefault();
  // });

  // ===========================================================

  // Array books
  const books = [];
  // Render Event
  const RENDER_EVENT = 'render_book';

  // Fungsi makeBook

  // Fungsi generateBookObject
  const generateBookObject = (id, title, author, year, isComplete) => ({
    id,
    title,
    author,
    year,
    isComplete,
  });

  // Fungsi tambahBuku
  const tambahBuku = () => {
    const generateID = +new Date();
    const title = on[0].value;
    const author = on[1].value;
    const year = on[2].value;
    const isComplete = !cekBelum.checked;

    const bookObject = generateBookObject(generateID, title, author, year, isComplete);

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  // Fungsi makeBook(bookObject)
  const makeBook = (bookObject) => {
    const textJudul = document.createElement('h4');
    textJudul.innerText = bookObject.title;

    const textPenulis = document.createElement('h5');
    textPenulis.innerText = bookObject.author;

    const textTahun = document.createElement('p');
    textTahun.innerText = bookObject.year;

    const textBungkus = document.createElement('section');
    textBungkus.classList.add('inner');
    textBungkus.append(textJudul, textPenulis, textTahun);

    const bungkus = document.createElement('section');
    bungkus.classList.add('item', 'shadow');
    bungkus.append(textBungkus);
    bungkus.setAttribute('id', `book-${bookObject.id}`);

    return bungkus;
  };

  formTambah.addEventListener('submit', (event) => {
    event.preventDefault();

    tambahBuku();
  });

  // Listener RENDER_EVENT
  document.addEventListener(RENDER_EVENT, () => {
    console.log(books);

    const bukuBelumSelesaiDibaca = document.getElementById('sampingBelum');
    bukuBelumSelesaiDibaca.innerHTML = '';

    for (let i = 0; i < books.length; i += 1) {
      const bookElement = makeBook(books[i]);
      bukuBelumSelesaiDibaca.append(bookElement);
    }
  });
});
