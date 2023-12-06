const $loginForm = document.querySelector(".login--form");
const $registerModal = document.querySelector("#register--modal");
const $registerForm = $registerModal.querySelector(".register--form");

let isNicknameValid = false;
const $nicknameValidSuccessMsg = $registerForm.querySelector(".success.nickname--message");
const $nicknameValidFailedMsg = $registerForm.querySelector(".failed.nickname--message");
const $faildRegister = $registerModal.querySelector('.failed.register--message');

const API_HOST = "http://localhost:8080";
const COOKIE_DOMAIN = "127.0.0.1";

$registerModal.querySelector("a.close").addEventListener("click", (e) => {
  $registerModal.style.display = "none";
});

$loginForm.querySelector("a").addEventListener("click", (e) => {
  $registerModal.style.display = "block";
});

$registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!registerAllValid()){

  }

  if (!isNicknameValid) {
    console.log("닉네임 인증을 해 주세요.");
    return;
  }
  console.log(e.target.loginId.value);
  fetch(`${API_HOST}/register`, {
    method: "POST",
    body: JSON.stringify({
      loginId: e.target.loginId.value,
      password: e.target.password.value,
      nickname: e.target.nickname.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        initNicknameValid();
        $registerForm.loginId.value = "";
        $registerForm.password.value = "";
        $registerForm.nickname.value = "";
        $faildRegister.style.display = 'none';
        $registerModal.querySelector(
          ".success.register--message"
        ).style.display = "block";
      }
      return res.json();

      // 리다이렉트는 프론트엔드 서버에서 처리
    })
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
    })
    .catch((err) => {
      $faildRegister.textContent = err.message;
      $faildRegister.style.display = 'block';
      console.log(err);
    });
});

$registerForm.nickname.addEventListener("keydown", (e) => {
  initNicknameValid();
});

$registerForm
  .querySelector(".register--nickname--wrap a")
  .addEventListener("click", (e) => {
    if (!emptyValid($registerForm.nickname.value)) return;
    fetch(
      `${API_HOST}/valid/nickname/${$registerForm.nickname.value}`
    )
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        isNicknameValid = data;
        if (data) {
          $nicknameValidFailedMsg.style.display = 'none';
          $nicknameValidSuccessMsg.style.display = "block";
        }else{
          $nicknameValidFailedMsg.style.display = 'block';
          $nicknameValidSuccessMsg.style.display = 'none';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

function emptyValid(str) {
  if (str.includes(" ")) return false;
  return str.length > 0;
}

function registerAllValid() {
  if (!emptyValid($registerForm.loginId.value)) return false;
  if (!emptyValid($registerForm.password.value)) return false;
  if (!emptyValid($registerForm.nickname.value)) return false;
  return true;
}

function initNicknameValid() {
  isNicknameValid = false;
  $nicknameValidSuccessMsg.style.display = "none";
}








// 로그인 로직.
const $emptyMsg = $loginForm.querySelector('.failed.empty');
const $faildLoginMsg = document.querySelector('.failed.login--message');
$loginForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  if( !(emptyValid(e.target.loginId.value) && emptyValid(e.target.password.value)) ){
    $emptyMsg.style.display = 'block';
  }

  fetch(`${API_HOST}/login`, {
    method: "POST",
    body: JSON.stringify({
      loginId: e.target.loginId.value,
      password: e.target.password.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(res=>{
    return res.json();
  })
  .then(data=>{
    if(data.success){
      setCookie('sessionId', data.sessionId, 30);
      // console.log(data);
    }else{
      throw new Error(data.message);
    }
  })
  .catch(err=>{
    $faildLoginMsg.textContent = err.message;
    $faildLoginMsg.style.display = 'block';
  });
});


function setCookie(name, value, miuntes){
  const date = new Date();
  date.setMinutes(date.getMinutes() + miuntes);

  const cookie = `${name}=${value}; expires=${date.toUTCString()}; path="/"; domain=${COOKIE_DOMAIN}`;
  document.cookie = cookie;
}

// 아쉽다! Spring Security의 필요성을 느꼈다.