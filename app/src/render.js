let recordingState = 'windowSelect'; // introduces a "state machine" for rendered page

switch(recordingState) {
    case 'windowSelect':
        buildDropdown();
        
        windowSelectBtn.addEventListener('mouseenter', function() {
            window.api.send('getWindows');
        })

        window.api.receive('sentWindows', (windows) => {
            makeMenu(windows);
        });

        break;

}

// makeMenu() creates items, which when clicked called some selectedWindow() function
// selectedWindow() function uses some preload api, which changes recordingState if the screen is valid
// when states are changed, the html page should be wiped

function makeMenu(windows) {
    let prevMenu = document.getElementById('dropdown-menu');
    if (prevMenu) {
        prevMenu.remove();
    }

    const dropdown_menu = document.createElement('div');
    dropdown_menu.setAttribute('id', 'dropdown-menu');
    dropdown_menu.setAttribute('class', 'dropdown-menu');
    document.getElementById('dropdown').appendChild(dropdown_menu);

    const dropdown_content = document.createElement('div');
    dropdown_content.setAttribute('id', 'dropdown-content');
    dropdown_content.setAttribute('class', 'dropdown-content');
    document.getElementById('dropdown-menu').appendChild(dropdown_content);

    

    windows.forEach(window => {
        let dropdown_item = document.createElement('a');
        dropdown_item.innerText = window.name;
        dropdown_item.setAttribute('class', 'dropdown-item');

        dropdown_content.appendChild(dropdown_item);
        dropdown_item.addEventListener('click', function() {selectedWindow(window)});
    });
}

function buildDropdown() {
    const dropdown = document.createElement('div');
    dropdown.setAttribute('class', 'dropdown is-hoverable');
    dropdown.setAttribute('id', 'dropdown');
    document.body.appendChild(dropdown);

    const dropdown_trigger = document.createElement('div');
    dropdown_trigger.setAttribute('class', 'dropdown-trigger');
    dropdown.appendChild(dropdown_trigger);

    const windowSelectBtn = document.createElement('button');
    windowSelectBtn.setAttribute('id', 'windowSelectBtn');
    windowSelectBtn.setAttribute('class', 'button');
    windowSelectBtn.setAttribute('aria-haspopup', 'true');
    windowSelectBtn.setAttribute('aria-controls', 'dropdown-menu');
    dropdown_trigger.appendChild(windowSelectBtn);

    const text_span = document.createElement('span');
    text_span.innerText = 'Select window';
    windowSelectBtn.appendChild(text_span);

    const icon_span = document.createElement('span');
    icon_span.setAttribute('class', 'icon is-small');
    windowSelectBtn.appendChild(icon_span);

    const icon = document.createElement('i');
    icon.setAttribute('class', 'fas fa-angle-down');
    icon.setAttribute('aria-hidden', 'true');
    icon_span.appendChild(icon);
}

function selectedWindow(window) {
    console.log('blahh');
}



// startCapture.addEventListener('click', function() {
//     window.api.send('startRecording');
// })

// stopCapture.addEventListener('click', function() {
//     window.api.send('stopRecording');
// })



// window.api.receive('renderVid', (stream) => {
//     console.log('rendering??');
//     vidPreview.srcObject = stream;
//     vidPreview.play();
// });


//--- I think this can go into the preload? navigator part requires electron or smth
window.api.receive('getMedia', function(){
    console.log('got media definitely');
    let mediaPromise = navigator.mediaDevices.getUserMedia(constraints);

    mediaPromise.then(
        function(media) {
            window.api.send('sentMedia', media);
        }
    )
});
