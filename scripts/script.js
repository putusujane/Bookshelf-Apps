const SAVED_EVENT = 'saved_book';
const KUNCI_STORAGE = 'RD_BOOKS';

// Array books
const books = [];
// Render Event
const RENDER_EVENT = 'render_book';

// Memeriksa jika support Storage
window.addEventListener('load', () => {
  if (typeof (Storage) !== 'undefined') {
    document.addEventListener(SAVED_EVENT, () => {
    });
  } else {
    // eslint-disable-next-line no-alert
    alert('Browser anda tidak mendukung Web Storage');
    return false;
  }

  return true;
});

// Fungsi saveData
const saveData = () => {
  const parsed = JSON.stringify(books);
  localStorage.setItem(KUNCI_STORAGE, parsed);
  document.dispatchEvent(new Event(SAVED_EVENT));
};

// Fungsi loadDataFromStorage
const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(KUNCI_STORAGE);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    for (let i = 0; i < data.length; i += 1) {
      books.push(data[i]);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

// Input judul dan elemen teks sisa karakter
const on = document.querySelectorAll('#inputJudul, #inputPenulis, #inputTahun');
const sisaKarakter = document.querySelectorAll('#sisaKarakterJudul, #sisaKarakterPenulis, #sisaKarakterTahun');
const tombolTambah = document.getElementById('tombolTambah');
const formTambah = document.getElementById('formTambah');

// Event pada form input
document.addEventListener('DOMContentLoaded', () => {
  loadDataFromStorage();

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
  }

  document.getElementById('cekBelum').checked = true;
  document.getElementById('cekSelesai').checked = false;
});

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

// ===========================================================

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
  const generateID = `${on[0].value.slice(0, 2)}-${new Date().getFullYear()}${new Date().getMilliseconds()}`;
  const title = on[0].value;
  const author = on[1].value;
  const year = on[2].value;
  const isComplete = !cekBelum.checked;

  const bookObject = generateBookObject(generateID, title, author, year, isComplete);

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  // saveData
  saveData();
};

// Fungsi cariBook
const cariBook = (idBuku) => {
  for (let i = 0; i < books.length; i += 1) {
    if (books[i].id === idBuku) {
      return books[i];
    }
  }
  return null;
};

// Fungsi TambahBukuKeComplete
const tambahBukuKeComplete = (idBuku) => {
  const bookTarget = cariBook(idBuku);

  if (bookTarget == null) {
    return;
  }

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  // saveData
  saveData();
};

// Fungsi cariBookIndex(idBuku)
const cariBookIndex = (idBuku) => {
  for (let i = 0; i < books.length; i += 1) {
    if (books[i].id === idBuku) {
      return books;
    }
  }

  return -1;
};

// Fungsi hapusBukuDariComplete
const hapusBukuDariComplete = (idBuku) => {
  const bookTarget = cariBookIndex(idBuku);

  if (bookTarget === -1) {
    return;
  }

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  // saveData
  saveData();
};

// Fungsi undoBukuDariComplete
const undoBukuDariComplete = (idBuku) => {
  const bookTarget = cariBook(idBuku);

  if (bookTarget === null) {
    return;
  }

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  // saveData
  saveData();
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
  bungkus.setAttribute('id', `${bookObject.id}`);

  // Kondisi isComplete
  if (bookObject.isComplete) {
    const tombolUndo = document.createElement('section');
    tombolUndo.classList.add('tombol-undo');
    tombolUndo.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
    tombolUndo.setAttribute('title', 'Tandai belum selesai dibaca');

    tombolUndo.addEventListener('click', () => {
      undoBukuDariComplete(bookObject.id);
    });

    const tombolSampah = document.createElement('section');
    tombolSampah.classList.add('tombol-sampah');
    tombolSampah.innerHTML = '<i class="fa-solid fa-square-minus"></i>';
    tombolSampah.setAttribute('title', 'Hapus buku');

    const bungkusUndoSampah = document.createElement('section');
    bungkusUndoSampah.setAttribute('id', 'bungkusUndoSampah');
    bungkusUndoSampah.append(tombolSampah, tombolUndo);

    tombolSampah.addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals, no-alert
      const konfirmasi = confirm('Apakah yakin ingin menghapus?');
      if (konfirmasi) {
        hapusBukuDariComplete(bookObject.id);
      }
      return false;
    });

    bungkus.append(bungkusUndoSampah);

    bungkus.style.background = '-webkit-linear-gradient(to right, rgba(68, 160, 141, 0.5), rgba(9, 54, 55, 0.8))';
    bungkus.style.background = 'linear-gradient(to right, rgba(68, 160, 141, 0.5), rgba(9, 54, 55, 0.8))';
  } else {
    const tombolSampah = document.createElement('section');
    tombolSampah.classList.add('tombol-sampah');
    tombolSampah.innerHTML = '<i class="fa-solid fa-square-minus"></i>';
    tombolSampah.setAttribute('title', 'Hapus buku');

    tombolSampah.addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals, no-alert
      const konfirmasi = confirm('Apakah yakin ingin menghapus?');
      if (konfirmasi) {
        hapusBukuDariComplete(bookObject.id);
      }
      return false;
    });

    const tombolCeklist = document.createElement('section');
    tombolCeklist.classList.add('tombol-ceklist');
    tombolCeklist.innerHTML = '<i class="fa-solid fa-square-check"></i>';
    tombolCeklist.setAttribute('title', 'Tandai selesai dibaca');

    const bungkusUndoSampah = document.createElement('section');
    bungkusUndoSampah.setAttribute('id', 'bungkusUndoSampah');
    bungkusUndoSampah.append(tombolSampah, tombolCeklist);

    tombolCeklist.addEventListener('click', () => {
      tambahBukuKeComplete(bookObject.id);
    });

    bungkus.append(bungkusUndoSampah);
    bungkus.style.background = '-webkit-linear-gradient(to right, rgba(5, 117, 230, 0.8), rgba(2, 27, 121, 0.8))';
    bungkus.style.background = 'linear-gradient(to right, rgba(5, 117, 230, 0.8), rgba(2, 27, 121, 0.8))';
  }

  return bungkus;
};

formTambah.addEventListener('submit', (event) => {
  event.preventDefault();
  tambahBuku();
  // eslint-disable-next-line no-alert
  alert('Buku berhasil disimpan!');

  on[0].value = '';
  on[1].value = '';
  on[2].value = '';
});

const searchBooks = () => {
  const searchInput = document.querySelector('#inputCari').value.toLowerCase();

  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchInput));

  if (searchInput !== null) {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';

    const kontenModal = document.querySelector('.modal-content');
    kontenModal.innerHTML = '<span style="float: right;" class="close" title="Tutup">&times;</span>';

    const spanModal = document.querySelector('.close');

    if (spanModal !== null) {
      spanModal.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });

    for (let i = 0; i < filteredBooks.length; i += 1) {
      kontenModal.append(makeBook(filteredBooks[i]));
    }
  }

  if (null) {
    document.querySelector('#searchInput').value = '';
  }
};

const formCari = document.getElementById('cari');
formCari.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchInput = document.querySelector('#inputCari').value.toLowerCase();
  if (searchInput === '') {
    alert('Judul tidak boleh kosong!');
    return;
  }
  searchBooks();
  document.querySelector('#inputCari').value = '';
});

// Listener RENDER_EVENT
document.addEventListener(RENDER_EVENT, () => {
  const bukuBaruDitambahkan = document.getElementById('bungkusBaruDitambahkan');
  bukuBaruDitambahkan.innerHTML = '';
  for (let i = 0; i < books.length; i += 1) {
    const bookElement = makeBook(books[i]);

    bukuBaruDitambahkan.append(bookElement);
  }

  const bukuBelumSelesaiDibaca = document.getElementById('sampingBelum');
  bukuBelumSelesaiDibaca.innerHTML = '';

  const bukuSudahSelesaiDibaca = document.getElementById('sampingSelesai');
  bukuSudahSelesaiDibaca.innerHTML = '';

  for (let i = 0; i < books.length; i += 1) {
    const bookElement = makeBook(books[i]);

    if (!books[i].isComplete) {
      bukuBelumSelesaiDibaca.append(bookElement);
    } else {
      bukuSudahSelesaiDibaca.append(bookElement);
    }
  }
});
