# GHTK front-end coding convention

## Quy tắc đặt tên

- Tên class viết theo kiểu **Upper Camel Case** (Pascal Case)

```Javascript
class User {
	...
}
```

- Tên hàm, tên biến viết theo kiểu **Lower Camel Case**

```Javascript
let name = "GHTK";
function getName() {
	...
}
```

- Tên hằng số viết hoa hết và nối bằng dấu gạch dưới **\_**

```Javascript
const MAX_LENGTH = 80;
```

- Tên thư mục viết thường và nối bằng dấu gạch ngang **-**

```
pages/home-page/index.js
```

- Tên file component viết theo kiểu **Upper Camel Case** (Pascal Case)

```
components/elements/GButton.vue
```

- Tên các file tĩnh như ảnh, css, video, mp3, ... viết thường và nối bằng dấu gạch dưới **\_**

```
assets/images/image_background.png
```

## Quy tắc khai báo, sử dụng

- Khai báo component theo kiểu **Upper Camel Case** (Pascal Case)

```Javascript
import GButton from '@/components/elements/GButton.vue';
```

- Sử dụng self-closing tags nếu component không có children

```Javascript
// bad
<component></component>

// good
<component />
```

- Object shorthand cho method: [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand.html)

```Javascript
// bad
const user = {
  getName: function () {
	  ...
  },
};

// good
const user = {
  getName() {
    ...
  },
};
```

- Object shorthand cho properties: [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand.html)

```Javascript
const name = "GHTK"

// bad
const user = {
  name: name,
};

// good
const user = {
  name,
};
```

- Don't add unneeded context

```Javascript
// bad
const Car = {
  carMake: "Honda",
  carModel: "Accord",
  carColor: "Blue"
};

function paintCar(car, color) {
  car.carColor = color;
}

// good
const Car = {
  make: "Honda",
  model: "Accord",
  color: "Blue"
};

function paintCar(car, color) {
  car.color = color;
}
```

- Đóng gói điều kiện

```Javascript
// bad
if (fsm.state === "fetching" && isEmpty(listNode)) {
  // ...
}

// good
function shouldShowSpinner(fsm, listNode) {
  return fsm.state === "fetching" && isEmpty(listNode);
}

if (shouldShowSpinner(fsmInstance, listNodeInstance)) {
  // ...
}
```

- Thứ tự khai báo properties object: shorthand properties -> normal properties -> shorthand function.

```Javascript
const user = {
  name,
  age: 28,
  getName() {
	  ...
  }
};
```

- Luôn để default params khi khai báo function xuống cuối

```Javascript
function showInfo(info, opts = {}) {
	...
}
```

- Luôn sử dụng default parameters nếu có thay cho điều kiện.

```Javascript
// bad
function createMicrobrewery(name) {
  const breweryName = name || "Hipster Brew Co.";
  // ...
}

// good
function createMicrobrewery(name = "Hipster Brew Co.") {
  // ...
}
```

- Không thay đổi trực tiếp params truyền vào function [`no-param-reassign`](https://eslint.org/docs/rules/no-param-reassign.html)
  > Tránh những ảnh hưởng không mong muốn

```Javascript
const user = {
  name: "GHTK",
  age: 28,
  status: 1,
};

function sayHello(_user) {
	_user.name = _user.name.toLowerCase();
	return `Wellcome ${ user.name } to GHTK`;
}

sayHello(user);
console.log(user); // {name: 'ghtk', age: 28, status: 1}
```

- Không sử dụng forEach nếu có thay đổi dữ liệu từng phần tử

```Javascript
// bad
users.forEach((user,  index)  =>  {
	user.id = index;
});

// good
const usersWithId = users.map((user,  index)  =>  {
	return Object.assign({}, user, { id: index });
});
```

- Luôn thêm dấu phẩy **,** vào cuối khai báo object, array, tham số truyền vào function khi có nhiều dòng [`trailing comma`](https://eslint.org/docs/rules/comma-dangle)
  > Giảm số dòng thay đổi khi merge code, hạn chế được conflict

```Javascript
// not use trailing comma
const objectStatusText = {
	1: 'Status 1',
	2: 'Status 2',
-   3: 'Status 3',
+   4: 'Status 4',
+   5: 'Status 5'
}

// use trailing comma
const objectStatusText = {
	1: 'Status 1',
	2: 'Status 2',
    3: 'Status 3',
+   4: 'Status 4',
+   5: 'Status 5',
}
```

## Quy tắc trong React

- Luôn sử dụng camelCase cho tên props.

```Javascript
// bad
<Foo
  hidden={true}
  UserName="hello"
  phone_number={12345678}
/>

// good
<Foo
  hidden
  userName="hello"
  phoneNumber={12345678}
/>
```

- Tránh sử dụng index của Array để làm key prop

```Javascript
// bad
{todos.map((todo, index) =>
  <Todo
    {...todo}
    key={index}
  />
)}

// good
{todos.map(todo => (
  <Todo
    {...todo}
    key={todo.id}
  />
))}
```

## Quy tắc viết css, scss

- Tên class viết thường nối nhau bằng dấu gạch nối **-**

```css
.btn-green {
  ...;
}
```

- Thêm tiền tố `js-` cho những class nào được tác động bởi Javascript

```html
<button class="js-add-user">Click me!</button>
```

- Đặt `@include` ở cuối cùng sau các thuộc tính

```css
.btn-green {
  background: green;
  font-weight: bold;
  @include transition(background 0.5s ease);
  ...;
}
```

- Đặt nested selectors sau `@include` của phần tử đó

```css
.btn {
  background: green;
  font-weight: bold;
  @include transition(background 0.5s ease);

  .icon {
    margin-right: 10px;
  }
}
```

- Không nên lồng nhau quá 3 cấp

```css
.page-container {
  .content {
    .profile {
      // STOP!
    }
  }
}
```

## Quy ước BEM

### 1, Giới thiệu:

- Là một quy ước đặt tên cho các class trong HTML và CSS
- BEM là viết tắt của từ Block, Element, Modifier.

### 2, Quy ước đặt tên:

```css
.block {
} /* Block */
.block__element {
} /* Element */
.block--modifier {
} /* Modifier */
```

- .block Thành phần cấp to nhất của abstraction hoặc component.
- .block**element Thành phần con bên trong của block (VD: info**title, info\_\_description là thành phần con bên trong info.)

```HTML
<div class="info">
  <div class="info__title">
  </div>
  <div class="info__description">
  </div>
</div>
```

```css
.info {
  background: #f2f4f7;
  margin-top: 23px;
  padding-bottom: 30px;
  &__description {
    font-size: 15px;
    font-family: 'Kozuka Gothic Pr6N', sans-serif;
  }
  &__title {
    font-size: 20px;
    font-family: 'Kozuka Gothic Pr6N', sans-serif;
    font-weight: bold;
  }
}
```

- .block--modifier Là 1 phiên bản # của block. Hay những thay đổi style khác so với style ban đầu(VD: block .btn---green là modifier)

```HTML
<a class="btn btn--green" href="#"></a>
```

```css
.btn {
  background: gray;
  border: 0;
  border-radius: 3px;
  box-shadow: none;
  padding: 5px 20px;
  color: #fff;
  font-size: 18px;
  line-height: 1.5;
}
/* style .btn--green   */

.btn--green {
  background: green;
}
```

### 3,Biến thể:

- Có thể sử dụng biến thể BEM cho việc viết đơn giản mà cung cấp cho chúng ta sự linh hoạt để cấu hình bất kỳ module nào. Nó phù hợp cho module với nhiều sửa đổi. Ví dụ như các button, icon, typography(kiểu chữ).
- VD về quy ước cũ

```HTML
<a class=" btn btn--primary btn--large btn--font-12 ....">
```

- VD về biến thể:

```HTML
 <a class="block -modifier">
```

```HTML
  <!-- Icon -->
   <i class="e-icon -icon-envato -color-green -size-xl -margin-right"></i>

   <!-- Typography -->
   <h2 class="t-heading -size-m -color-light">Heading</h2>
   <p class="t-body -size-s">Paragraph</p>

   <!-- Inputs -->
   <input class="f-input -type-string -width-full">

   <!-- Notifications -->
   <div class="alert-box -type-success">
     <div class="alert-box__icon">
       <i class="e-icon -icon-ok"></i>
     </div>
     <div class="alert-box__message">
       <p class="t-body -size-m h-remove-margin">Success!!</p>
     </div>
   </div>
   <!-- Button -->
   <button class="btn -color-green -bg-blue"></button>
```

```css
.btn {
  &.-color-green {
  }
  &.-bg-blue {
  }
}
```
