let canvas = document.querySelector("canvas"),

    toolBtns = document.querySelectorAll(".tool"),

    fillColor = document.querySelector("#fill-color"),

    sizeSlider = document.querySelector("#size-slider"),

    colorBtns = document.querySelectorAll(".colors .option"),

    colorPicker = document.querySelector("#color-picker"),

    clearCanvas = document.querySelector(".clear-canvas"),

    saveImg = document.querySelector(".save-img"),

    ctx = canvas.getContext("2d");

//Global Variables With Default Values

let prevMouseX, prevMouseY, snapshot,

    isDrawing = false,

    selectedTool = "brush",

    brushWidth = 5,

    selectedColor = "#000";

let setCanvasBackground = () => {

    ctx.fillStyle = "#fff";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Setting fillStyle Back To The selectedColor. It Will Be The Brush Color

    ctx.fillStyle = selectedColor;

};

window.addEventListener("load", () => {

    //Setting Canvas Width And Height ... offsetWidth/Height Returns Viewable width/height Of An Element;

    canvas.width = canvas.offsetWidth;

    canvas.height = canvas.offsetHeight;

    setCanvasBackground();

});

let drawRect = (e) => {

    //If fillcolor Isn't checked Draw A Rect With Border else Draw Rect With Background

    if (!fillColor.checked) {

        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);

    };

    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);

};

let drawCircle = (e) => {

    //Creating New Path To Draw Circle

    ctx.beginPath();

    //Getting Radius For Circle According To The Mouse Pointer

    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))

    //arc() Method Is Used To Create A Circle

    //Creating Circle According To The Mouse Pointer

    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);

    //If fillColor Is checked fill Color else Draw Border Circle

    fillColor.checked ? ctx.fill() : ctx.stroke();

};

let drawTriangle = (e) => {

    //Creating New Path To Draw Circle

    ctx.beginPath();

    //moveTo() Method Moves The Path To The Specified Point

    //Moving Triangle To The Mouse Pointer

    ctx.moveTo(prevMouseX, prevMouseY);

    //Creating First Line According To The Mouse Pointer

    ctx.lineTo(e.offsetX, e.offsetY);

    //Creating Bottom Line Of Triangle

    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);

    //Closing Path Of A Triangle So The Third Line Draw Automatically

    ctx.closePath();

    ctx.stroke();

    //If fillColor Is checked fill Triangle else Draw Border

    fillColor.checked ? ctx.fill() : ctx.stroke();

};

let startDraw = (e) => {

    isDrawing = true;

    //Passing Current nouseX Position As prevMouseX Value;

    prevMouseX = e.offsetX;

    //Passing Current nouseY Position As prevMouseY Value;

    prevMouseY = e.offsetY;

    //Creating New Path To Draw

    ctx.beginPath();

    //Passing Brush Size As Line Width

    ctx.lineWidth = brushWidth;

    //Passing selectedColor As strokeStyle

    ctx.strokeStyle = selectedColor;

    //Passing selectedColor As fillStyle

    ctx.fillStyle = selectedColor;

    //Copying canvas Data And Passing As SnapShot Value ... This Avoids Dragging The Image

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

};

let drawing = (e) => {

    //If isDrawing Is False Return From Here

    if (!isDrawing) return;

    //Adding Copying canvas Data On To This Canvas;

    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {

        //If selectedTool Is eraser Then Set strokeStyle To White

        //To Paint White Color On To The Existing Canvas Content else Set The stroke color To selectedColor

        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;

        //Creating Line According To The Mouse Pointer

        ctx.lineTo(e.offsetX, e.offsetY);

        //Drawing/Filling Line With Color

        ctx.stroke();

    } else if (selectedTool === "rectangle") {

        drawRect(e);

    } else if (selectedTool === "circle") {

        drawCircle(e);

    } else {

        drawTriangle(e);

    };

};

toolBtns.forEach(btn => {

    //Adding A Click Event To ALL Tool Options

    btn.addEventListener("click", () => {

        //Removing active class From The Previous Option,

        document.querySelector(".options .active").classList.remove("active");

        //And Adding On Current Clicked Option

        btn.classList.add("active");

        selectedTool = btn.id;

    });

});

//Passing Slider Value As Brush Size

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

//Adding Click Event To ALL Color Buttons

colorBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        //Removing selected class From The Previous Option,

        document.querySelector(".options .selected").classList.remove("selected");

        //And Adding On Current Clicked Option

        btn.classList.add("selected");

        //Passing selected btn Background As selectedColor Value

        // console.log(window.getComputedStyle(btn).getPropertyValue("background-color"));

        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");

    });

});

colorPicker.addEventListener("change", () => {

    //Passing Picked Color from colorPicker To last Color btn Background

    colorPicker.parentElement.style.background = colorPicker.value;

    colorPicker.parentElement.click();

});

clearCanvas.addEventListener("click", () => {

    //clearRect() Method Clears The Specified Pixels Within A Given Rectangle

    //Clearing Whole Canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setCanvasBackground();

});

saveImg.addEventListener("click", () => {

    //Creating An a Element

    let link = document.createElement("a");

    link.download = `${Date.now()}.jpg`;

    //toDataURL() Method Returns A Data URL Of The Image

    //Passing canvas Data As link href Value

    link.href = canvas.toDataURL();

    //Clicking link To Download Image

    link.click();

});

canvas.addEventListener("mousedown", startDraw);

canvas.addEventListener("mousemove", drawing);

canvas.addEventListener("mouseup", () => isDrawing = false);

