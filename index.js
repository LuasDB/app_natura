import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword ,signInWithEmailAndPassword,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";
import { getDatabase,ref,set,child, get, push,query, orderByChild,update } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyCbok1jgu6NgEOFvDDCJ4HMYTO6xsv-klo",
    authDomain: "app-natura-af009.firebaseapp.com",
    databaseURL: "https://app-natura-af009-default-rtdb.firebaseio.com",
    projectId: "app-natura-af009",
    storageBucket: "app-natura-af009.appspot.com",
    messagingSenderId: "189919654229",
    appId: "1:189919654229:web:ee7c983ee05c121d243fdc"
  };

  // Inicializacion  Firebase y base de datos de Firestore
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();
//*************Autenticación *************************************************************************************** */
 //Iniciar siempre fuera de la sesion
// signOutSesion();

//Datos de usuario
const name = "Brenda Lopez";
const email = "saul@correo.com";
const password = "quesadilla16";
const whatsapp = "525533262860";
const userName = "nickname";
const date = new Date();
const year = date.getFullYear();

let idUser = null;
let productosNuevos = {};
let envioProductos = [];
let pedidoClienteId = null;
let statusNewOrder = false;
let countProducts = 0;
let totalCostProducts = 0;
let nameP = '';
let keyP = '';
let priceP = '';
let formaPago = '';


//--------------Envio de información ---------------------------------------
function writeUserData(userId, name, lastName, whatsapp, email) {
  
  if (set(ref(db, 'users/' + userId), {
    userName: name,
    userLastName: lastName,
    email: email,
    whatsapp: whatsapp,
    customers: 'null',
    cycles:'null'
    
  })) { 
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Tu cuenta ha sido creada!',
    showConfirmButton: false,
    timer: 2500
  });
  
  }
}
onAuthStateChanged(auth, (user) => {
  if (user) {

    const uid = user.uid;
    
    idUser = uid;
    console.log(uid);
    console.log('Estamos adentro con :' + idUser);
    document.querySelector('body').style.backgroundColor = 'var(--secundary-light)';
    document.querySelector('.login').classList.add('hide');
    document.querySelector('.header-label').classList.remove('hide');
    document.querySelector('aside').classList.remove('hide');
    document.querySelector('.monitor').classList.remove('hide');
    const refUser = ref(db, 'users/' + idUser);
    get(refUser).then((name) => {
      
       document.querySelector('#name_user').innerHTML = name.val().userName;
    });
   

    callHome();
  }
  else {
    document.querySelector('body').style.backgroundColor = 'var(--white)';
  }
});

//***********Autenticar usuario**************************************************************************************************************************** */
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     console.log('Autenticado:' + user.uid);
//     idUser = user.uid;
    
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     window.location.href = "login.html";
//   });

//**********Creacion de usuarios********************************************************************************************************************************//
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
    
//     const user = userCredential.user;
//     writeUserData(user.uid,name, email, whatsapp,userName);
    
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });
//**********Cerrar sesion ********************************************************************************************************************************//

 
  //****Funciones de la app**************************************************************************************************************************************//

const monitor_login = document.querySelector('.login');
const monitor = document.querySelector('.monitor');
const aside = document.querySelector('aside');
//*************PRINCIPAL LISTENERS***************************************************************************************************** */
function listeners() {
  monitor_login.addEventListener('click', (e) => {

    
    let resultado = e.target.innerHTML;


    switch (resultado) {
      case 'Crear una cuenta':
        document.querySelector('.container-login').classList.add('hide');
        document.querySelector('.form-new-user').classList.remove('hide');
        break;
      case 'Olvide mi contraseña':
        console.log('Se envia formulario para recuperacion de cuenta');
        break;
      case 'Aceptar':
        createNewUser();
        break;
      case 'Ingresar':
        signIn();
        break;
    }
  });

  aside.addEventListener('click', (e) => {
    if (statusNewOrder) {
      Swal.fire({
        title: '¿Deseas salir?',
        text: "Tus cambios no se han guardado y se perderan",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, salir'
            }).then((result) => {
              
              if (result.isConfirmed) {
          statusNewOrder = false;
          Swal.fire(
            'Saliste',
            'Tus cambios no se guardaron',
            'success'
          )
        }
      })
    } else {
      
      let opcion_menu = e.target.id;
    console.log(opcion_menu);
    switch (opcion_menu) {
      case 'clientes':
        // createNewCustomer(idUser);
        callCustomersList(idUser);
        break;
      case 'inicio':
        callHome();
        break;
      case 'salir':
        signOutSesion();
        break;
      case 'ciclos':
        callCyclesByUser();
        break;
      
    }
    }
    

  });

  monitor.addEventListener('click', (e) => {
    let opcion_monitor = e.target.id;
    let cliente = opcion_monitor.split(':');
    console.log(cliente);
    switch (opcion_monitor) {
      case 'nuevo_cliente':
        callFormNewCustomer();
        break;
      case 'aceptar_nvoCliente':
        createNewCustomer(idUser);
        break;
      case 'nuevo_producto':
        document.querySelector('#nuevo_producto').classList.add('hide');
        let form = document.querySelector('#newProduct');
        form.classList.remove('hide');
              break;
      case 'agregar_producto':
        createNewOrder();

        break;
      case 'guardar_pedido':
        sendOrderDB();
        break;
      case 'nuevo_ciclo':
        createNewCycle();
        break;
      case 'aceptar_nvoCiclo':
        sendCycleDB();
        callHome();
        break;
      
    }

    if (cliente[0] === 'customer') { callCustomerById(cliente[1]); }
    if (cliente[0] === 'nuevo_pedido') { callNewOrderByCustomer(cliente[1]); }

  });
  
}
//*****FUNCIONES**************************************************** */
//******FUNCIONES UTILES************************************************************ */
function objectToArray(object) {
  //FUncion para convertir un objeto en array para realizar su recorrido:
    let pedidosArray = Object.keys(object).map((key) => {
      return [String(key),object[key]];
    });
  return pedidosArray;
}

//******FUNCIONES DE LA APP************************************************************ */
function createNewUser() {
  
  const messageError = document.querySelector('.message-error');
  const userName = document.querySelector('#userName');
  const userLastName = document.querySelector('#userLastName');
  const userWhatsapp = document.querySelector('#userWhatsapp');
  const userEmail = document.querySelector('#userEmail');
  const userPassword = document.querySelector('#userPassword');
  const userPassword2 = document.querySelector('#userPassword2');
  messageError.innerHTML = '';

  if (userName.value === '' || userLastName.value === '' || userWhatsapp.value === '' || userEmail.value === '' || userPassword.value === '' || userPassword2.value === '') {
    let message = document.createElement('p');
    message.innerHTML = 'Todos los campos deben ser llenados';
    messageError.appendChild(message);
    Swal.fire({
      title: 'Error!',
      text: 'Por favor todos los campos deben ser llenados',
      footer: '😬',
      icon: 'error',
      confirmButtonText: 'ok'
    });

    return;
  }
  let pass1 = userPassword.value;
  if (pass1.length < 6) {
    let message = document.createElement('p');
    message.innerHTML = 'La contraseña debe tener minimo 6 caracteres ';
    messageError.appendChild(message);
    return;
  }
  if (userPassword.value != userPassword2.value) {
    Swal.fire({
      title: 'UPS!',
      text: 'Las contraseñas no coinciden😕',
      icon: 'error',
      confirmButtonText: 'ok'
    });
    return;
  }
  console.log('Inicia cesion de creacion de cuenta');

  createUserWithEmailAndPassword(auth, userEmail.value, userPassword.value)
  .then((userCredential) => {
    
    const user = userCredential.user;
    console.log('Credencial : ' + user);
    writeUserData(user.uid,userName.value, userLastName.value, userWhatsapp.value,userEmail.value);
    document.querySelector('.form-new-user').classList.add('hide');
    document.querySelector('.container-login').classList.remove('hide');
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });


  
}
function createNewCycle(){
  monitor.innerHTML = `
  <section class="section-new-cycle ">
            <h2>REGISTRAR NUEVO CICLO</h2>
            <p>Completa la información para registrar el nuevo ciclo:</p>
            
            <label for="cycle">Ciclo No:</label>
            <input type="number" name="cycle" placeholder="Numero de coclo ej: 1" id="number_cycle">
            <label for="cycle_start">¿Cuando inicia?:</label>
            <input type="date" name="cycle_start" placeholder="Inicio de ciclo: dd/mm/aaaa" id="cycle_start">
            <label for="cycle_end">¿Cuando finaliza?:</label>
            <input type="date" name="cycle_end" placeholder="Inicio de ciclo: dd/mm/aaaa" id="cycle_end">
            
            <button class="btn-success" id="aceptar_nvoCiclo">Aceptar</button>
            <button class="btn-cancel">Cancelar</button>
        </section>
  `;
}
function reiniciarForm() {
  let nameProduct = document.querySelector('#name-product');
  let keyProduct = document.querySelector('#key-product');
  let priceProduct = document.querySelector('#price-product');
  document.querySelector('#nuevo_producto').classList.remove('hide');
  nameProduct.value = '';
  keyProduct.value = '';
  priceProduct.value = '';
  document.querySelector('.card-new-product').classList.add('hide');
  
}
function signOutSesion(){
  signOut(auth).then(() => {
    console.log('Se cerro la sesion ');
    
    document.querySelector('.login').classList.remove('hide');
    document.querySelector('.header-label').classList.add('hide');
    document.querySelector('aside').classList.add('hide');
    document.querySelector('.monitor').classList.add('hide');

    


}).catch((error) => {
  console.log('Un error en el cierre de sesion:' + error);
});
}
function callHome() {
  monitor.innerHTML = '<h1>Estas en el Home</h1>';
}
function signIn() {
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  console.log('email:' + email.value);
console.log('pass:' + password.value);
  signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('Autenticado:' + user.uid);
    idUser = user.uid;
    
    document.querySelector('.login').classList.add('hide');
    document.querySelector('.header-label').classList.remove('hide');
    document.querySelector('aside').classList.remove('hide');
    document.querySelector('.monitor').classList.remove('hide');
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    document.querySelector('.login').classList.remove('hide');
    document.querySelector('.header-label').classList.add('hide');
    document.querySelector('aside').classList.add('hide');
    document.querySelector('.monitor').classList.add('hide');
    
  });

}
function createNewOrder() {
  let cardOrder = document.querySelector('#cardOrder');
  let dataOrder = document.querySelector('.data-product');
  let ciclo = document.querySelector('#cycles');
  let nameProduct = document.querySelector('#name-product');
  let keyProduct = document.querySelector('#key-product');
  let priceProduct = document.querySelector('#price-product');
  let total = document.querySelector('.total');
  nameP = nameProduct.value;
  keyP = keyProduct.value;
  priceP = priceProduct.value;
  console.log('COntador:' + countProducts);
  cardOrder.classList.remove('hide');
  if (!statusNewOrder) {
    let cicloNew = document.createElement('p');
    cicloNew.classList.add('title');
    cicloNew.innerHTML = 'Ciclo ' + ciclo.value;
    dataOrder.appendChild(cicloNew);
    statusNewOrder = true;
    
  }
  let contenidoNew = document.createElement('div');
 
  if (nameProduct.value === '' || keyProduct.value === '' || priceProduct.value === '') {
    Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'Ningun campo debe estar vacio!',
    showConfirmButton: true,
    
  });
    return;
  }
  contenidoNew.setAttribute('id','product' + countProducts);
    contenidoNew.innerHTML = `
      <span>${nameProduct.value}</span>
      <p class="clave">Clave: ${keyProduct.value}</p>
      <p class="price">Precio: <span>$ ${priceProduct.value}</span></p>
    `;
  dataOrder.appendChild(contenidoNew);
  
  const refPedidos = ref(db, 'users/' + idUser + '/customers/' + pedidoClienteId + '/pedidos/ciclo' + ciclo.value + '/productos');
  get(refPedidos).then((snapshot) => {
    if(snapshot.val()){
    
    let ultimo = Number(snapshot.val().length) + countProducts;

    console.log('ultimo:' + ultimo);
    
    envioProductos.push({
      id: ultimo,
      nombre: nameP,
      precio:priceP,
      clave:keyP
    });
    countProducts++;
     //--------------------
    }
    else {
      let ultimo = 0 + countProducts;
      console.log('ultimo:' + ultimo);
      envioProductos.push({
      id: ultimo,
      nombre: nameP,
      precio:priceP,
      clave:keyP
    });
    countProducts++;
      
    }
   
    // set(refNew, { nombre: nameProduct.value, precio: priceProduct.value, clave: keyProduct.value });
  });
  
  totalCostProducts += Number(priceProduct.value);
  total.innerHTML = `$ ${totalCostProducts}`;
  
  
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Se agrego correctamente',
    showConfirmButton: true,
    timer: 2500
  });


  //****Reiniciamos el Form************************************************************ */
  reiniciarForm();
  
  
  
}
/****SEND DB FIREBASE********************************************************************************************* */
function sendOrderDB() {
  let ciclo = document.querySelector('#cycles');
  let metodoPago = document.querySelector('#metodo-pago');
  let total = 0;

  envioProductos.forEach(product => {
    let refProduct = ref(db, 'users/' + idUser + '/customers/' + pedidoClienteId + '/pedidos/ciclo' + ciclo.value + '/productos/'+ product.id);
    set(refProduct, {
      nombre: product.nombre,
      clave: product.clave,
      precio:product.precio
    });
    total += Number(product.precio);
  });

  let refPago = ref(db, 'users/' + idUser + '/customers/' + pedidoClienteId + '/pedidos/ciclo' + ciclo.value);
  update(refPago, {
    formaPago:metodoPago.value
  });

  statusNewOrder = false;
  envioProductos = [];
  countProducts = 0;
  
  updateOweCustomer(total);

    Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Se agrego el pedido!',
    showConfirmButton: true,
    timer: 2500
  });
  callHome();
}
function sendCycleDB() {
  let cycle = document.getElementById('number_cycle').value;
  let cycle_start = document.getElementById('cycle_start').value;
  let cycle_end = document.getElementById('cycle_end').value;

  if (cycle === '' || cycle_start === '' || cycle_end === '' ) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Todos los campos deben ser llenados',
      showConfirmButton: false,
      timer: 2500
    });
    return;
  } else {
    const refCycles = ref(db, 'users/' + idUser + '/cycles/' + year + '/ciclo' + cycle);
    
    get(refCycles).then((cycles) => {
      console.log(cycles.val());
      if(cycles.val()===null) {
        const refNewOrder = ref(db, 'users/' + idUser + '/cycles/'+ year +'/ciclo' + cycle);
        set(refNewOrder, { number: cycle, total: 0, totalProducts: 0, gananciaNeta: 0,totalClientes:0});
         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Tu ciclo se dio de alta correctamente!',
          showConfirmButton: false,
          timer: 2500
        });
      }else if (cycles.val().number === cycle) {
         Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Este numero de ciclo ya existe',
          showConfirmButton: false,
          timer: 2500
        });
      } 

    });
    
    
  }


}
function updateOweCustomer(total) {
  let refOwe = ref(db, 'users/' + idUser + '/customers/' + pedidoClienteId);

  get(refOwe).then((snapshot) => {
    let owe = Number(snapshot.val().owe) + Number(total);
    update(refOwe, {owe:owe});
  });
}
function createNewCustomer(idUser) {
  console.log('Entramos en :' + idUser);

  // const nameCustomer = 'Carolina Ross';
  // const lastNameCustomer = 'Ross Ross';
  // const ageCustomer = 30;
  // const whatsapp = 5534554455;
  // const emailCustomer = 'carolina@correo.com';
  // const birthdayCustomer = '12-08-1990';
  // const zone = 'Azcapotzalco';
  // const mediumCustomer = 'Llamar en las noches , solo whatsapp';
  // const hobbiesCustomer = 'Le gusta el rock and roll';

  let nameCustomer = document.querySelector('#name_customer').value;
  let lastNameCustomer = document.querySelector('#lastName_customer').value;
  let ageCustomer =document.querySelector('#age_customer').value;
  let whatsapp = document.querySelector('#whatsapp_customer').value;
  let emailCustomer = document.querySelector('#email_customer').value;
  let birthdayCustomer = document.querySelector('#birthday_customer').value;
  let zone = document.querySelector('#zone_customer').value;
  let mediumCustomer =  document.querySelector('#schedule_customer').value;
  let hobbiesCustomer = document.querySelector('#hobbie_customer').value;

  let data = {
    nameCustomer: nameCustomer,
    lastNameCustomer: lastNameCustomer,
    ageCustomer: ageCustomer,
    whatsapp: whatsapp,
    emailCustomer: emailCustomer,
    birthdayCustomer: birthdayCustomer,
    zone: zone,
    mediumCustomer: mediumCustomer,
    hobbiesCustomer: hobbiesCustomer,
    owe: 0
    
  }
  
  const refCustomers = ref(db, 'users/' + idUser + '/customers');
  let refNewCustomer = ref(db, 'users/' + idUser + '/customers/0');
  get(refCustomers).then((snapshot) => {
    console.log('este es el snap:' + snapshot.val() )
    if (snapshot.val() === 'null') {
      console.log('Es el dato 0');
     
    }
    else {
      console.log('es un nuevo cliente');
      refNewCustomer = ref(db, 'users/' + idUser + '/customers/' + snapshot.val().length);
    }
    set(refNewCustomer, data);
    Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Tu cliente se dio de alta!',
    showConfirmButton: true,
    timer: 2500
  });
    callCustomersList(idUser);
  });
}
function callCustomersList(idUser) {
  
  monitor.innerHTML = '';
  let list = document.createElement('section');
  list.classList.add('section-customers');
  list.innerHTML = `
    <div class="browser">
      <label for="browser">
          <i class="fas fa-search"></i>
          <input type="text" name="browser" id="browser">
      </label>
      <button class="btn-browse">Buscar</button>
    </div>
     <button class="btn-new-order" id="nuevo_cliente"><i class="fas fa-plus-circle"></i> NUEVO CLIENTE </button>`;
  const refUsers = ref(db, 'users/' + idUser + '/customers');
  get(refUsers).then((snapshot) => {
    if (snapshot.exists()) {
      
      let customers = snapshot.val();
      if (customers!='null') {
        
        customers.forEach((customer,index) => {
          list.innerHTML += `
        <div class="card-customer card" id="customer:${index}">
                <span class="name" id="customer:${index}">${customer.nameCustomer} ${customer.lastNameCustomer}</span>
                <p class="customer-owe" id="customer:${index}">Adeudo : <span>$ ${customer.owe}</span></p>
                <p class="whatsapp-number" id="customer:${index}"><i class="fab fa-whatsapp"></i> ${ customer.whatsapp}</p>

            </div>`;
        });
       
      }
      else {
        list.classList.add('section-customers');
        list.innerHTML = `
          <h1>No tienes clientes registrados aun</h1>
          <button class="btn-new-order" id="nuevo_cliente"><i class="fas fa-plus-circle"></i> NUEVO CLIENTE </button>
        `;
      }
      monitor.appendChild(list);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

  
}
function callCustomerById(idCustomer) {
  console.log('Cliente No.:' + idCustomer);
  monitor.innerHTML = '';
  let customer = document.createElement('section');
  customer.classList.add('section-customer');
  

  const refCustomer = ref(db, 'users/' + idUser + '/customers/' + idCustomer);
  get(refCustomer).then((snapshot) => {
    
    let person = snapshot.val();
    
    customer.innerHTML = `
    <h1>Informacion del cliente</h1>
    <div class="card">
    <h2>${person.nameCustomer} ${person.lastNameCustomer} </h2>
    <h3>Edad: <span>${person.ageCustomer}</span></h3>
    <h3>Cumpleaños: <span>${person.birthdayCustomer}</span></h3>
    <h3>Hobbies: <span>${person.hobbiesCustomer}</span></h3>
    <h3>Horario de contacto: <span>${person.mediumCustomer}</span></h3>
  
    <p class="whatsapp-number"><i class="fab fa-whatsapp"></i> ${person.whatsapp}</p>
    <p class="customer-owe">Adeudo total: <span>$${person.owe}</span></p>
    </div>
    <button class="btn-new" id="nuevo_pedido:${idCustomer}"><i class="fas fa-plus-circle"></i> Nuevo pedido</button>
    <h3>Historial de pedidos</h3>
    `;
    //Asignamos una variable para construir el contenido
    let contenido = '';
    
    const refPedidos = ref(db, 'users/' + idUser + '/customers/'+ idCustomer + '/pedidos');
    
    get(refPedidos).then((snap) => {
      if (snap.val() === null) {
        customer.innerHTML += '<h2>Aun no hay pedidos de este cliente</h2>';
        
        return;
      }
      let pedidos = objectToArray(snap.val());
      
      pedidos.forEach(pedido => {
        let total = 0;
        
        contenido += `
          <div class="card card-product">
            <p class="title">${pedido[0]} </p>
            <div class="data-product"> 
        `;

        let productos = objectToArray(pedido[1].productos);
        productos.forEach(producto => {
          contenido += `
           <span>${producto[1].nombre}</span>
                    <p class="clave">Clave:${producto[1].clave}</p>
                    <p class="price">Precio: <span>$ ${producto[1].precio}</span></p>
          `;
          total += Number(producto[1].precio);
        });
        
        let pago = objectToArray(pedido[1]);
        
        contenido += ` </div>
                <div class="data-product">
                    <p class="title">Seguimiento de pago</p>
                    <span>${pago[0][1]}</span>
                    <p class="price">Adeudo: <span>$ ${total}</span></p>
                    <button class="btn-pago" id="pago:${pedido[0]}" >Registrar pago</button>

                </div> </div>`;
      });
      customer.innerHTML += contenido;
    });    
    //FINALIZA LA INSPECCION DE LOS PEDIDOS    
  });
  monitor.appendChild(customer);
}
function callNewOrderByCustomer(idCustomer) {

  //Inicializamos variables globales a utilizar
  totalCostProducts = 0;
  statusNewOrder = false;
  countProducts = 0;
  pedidoClienteId = idCustomer;
  monitor.innerHTML = '';
  let contenido = '';
  const refCustomer = ref(db, 'users/' + idUser + '/customers/' + idCustomer);
  get(refCustomer).then((snapshot) => {
    contenido += `
    <section class="section-new-order ">
      <h2>Agrega los elementos del nuevo pedido</h2>
      <h3 id="pedido_cliente:${idCustomer}">Cliente: <span>${snapshot.val().nameCustomer} ${snapshot.val().lastNameCustomer}</span></h3>
      <label for="cycles"></label>
      <select name="cycles" id="cycles">
          <option value="10">Ciclo 10</option>
          <option value="11">Ciclo 11</option>
          <option value="12">Ciclo 12</option>
      </select>
      <button class="btn-new-order" id="nuevo_producto"><i class="fas fa-plus-circle"></i> Nuevo producto</button>
      <div class="card card-new-product hide" id="newProduct">
      <label for="name-product">Nombre del producto:</label>
  <input type="text" id="name-product" name="name-product">
  <label for="key-product">Clave del producto:</label>
  <input type="number" id="key-product" name="key-product">
  <label for="price-product">Precio :</label>
  <label for="">$<input type="number" id="price-product" name="price-product"></label>
  <button class="btn-success" id="agregar_producto">Agregar</button>
      </div>
       <div class="card card-product hide" id="cardOrder" >

        <div class="data-product"></div>
        <div class="data-product part2">
        <label for="cycles">Forma de pago :</label>
          <select name="metodo-pago" id="metodo-pago">
            <option value="Pago contra entrega">Pago contra entrega</option>
            <option value="Dos pagos quincenales">Dos pagos quincenales</option>
            
          </select>
          <p>Total: <span class="total">$0</span></p> 
          <button class="btn-pago" id="guardar_pedido">Guardar pedido</button>
          <button class="btn-cancel" id="cancelar_pedido">Cancelar</button>
        </div>
       
       </div>
    </section>
    `;
     monitor.innerHTML += contenido;
  });
 
  
}
function callCyclesByUser() {
  monitor.innerHTML = '';
  let sectionCycle = document.createElement('section');
  sectionCycle.classList.add('section-cycles');
  sectionCycle.innerHTML = `
    <h2>Ciclos registrados en tu cuenta:</h2>
   <button class="btn-new-order" id="nuevo_ciclo"><i class="fas fa-plus-circle"></i> NUEVO CICLO</button>
  `;
  let card = document.createElement('div');
  
  let contCard = '';

  const refCycles = ref(db, 'users/' + idUser);

  get(refCycles).then((dataUser) => {
    if (dataUser.val().cycles === 'null') {
      sectionCycle.innerHTML += `
      <h3>No cuentas con ningun ciclo registrado</h3>
      `;
    } else {
      
      Object.entries(dataUser.val().cycles).forEach(([key, value]) => {
        console.log('Año:' + key);
        
        contCard += `
          <h2>Resumen año ${key}</h2>`;
       
        
        Object.entries(value).forEach(([key2, value2]) => {
         
         
          console.log('Ciclo:' + key2);
          contCard += `
          <div class="card">
          <div class="data-cycle">
          <h3>Ciclo ${value2.number}</h3>
          <p>Total vendido: <span>$ ${value2.total}</span></p>
          <p>Total de articulos vendidos: <span>${value2.totalProducts}</span></p>
          <p>Total de clientes: <span>${value2.totalClientes}</span></p>
          <p class="result">Ganancia neta: <span class="ganancia">$ ${value2.gananciaNeta}</span></p>
          </div></div>
        `;
        card.innerHTML = contCard;
        sectionCycle.appendChild(card);
          
        });
         
       
        
      });
      
     
    }

   
    monitor.appendChild(sectionCycle);
  });
  
}
//***************** FORMS  ******************************************************* */
function callFormNewCustomer() {
  monitor.innerHTML = '';
  let formNewCustomer = document.createElement('section');
  formNewCustomer.classList.add('section-add-customer');
  formNewCustomer.innerHTML = `
  <h2>REGISTRAR NUEVO CLIENTE</h2>
            <p>Completa la siguiente información de tu nuev@ clienta(e)</p>
            <p class="note">*Podras editar esta información cada que lo requiras</p>
            <label for="name">Nombre(s):</label>
            <input type="text" name="name" placeholder="Su nombre(s)" id="name_customer">
            <label for="apellidos">Apellidos:</label>
            <input type="text" name="apellidos" placeholder="Sus pellidos" id="lastName_customer">
            <label for="age">Edad:</label>
            <input type="number" name="age"  id="age_customer">
            <label for="whatsapp">Whatsapp:</label>
            <input type="number" name="whatsapp" placeholder="Ejemplo: 5521253422" id="whatsapp_customer">
            <label for="email">Email:</label>
            <input type="text" name="email" placeholder="Su email " id="email_customer">
            <label for="cumpleaños">Cumpleaños:</label>
            <input type="date" name="cumpleaños" placeholder="Su cumpleaños" id="birthday_customer">
            <label for="zona">Zona:</label>
            <input type="text" name="zona" placeholder="Zona " id="zone_customer">
            <label for="horario">Horario y medio de contacto:</label>
            <input type="text" name="horario" placeholder="Horario " id="schedule_customer">
            <label for="hobbies">Gustos y hobbies:</label>
            <input type="text" name="hobbies" placeholder="hobbies " id="hobbie_customer">

            <button class="btn-success" id="aceptar_nvoCliente">Aceptar</button>
            <br><button class="btn-cancel">Cancelar</button>
       `;
  monitor.appendChild(formNewCustomer);
  
  


}



listeners();