import createChild from 'elements/child';
import { createJson } from 'index';

export function makeId(){
        let text = 'group_';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    [...Array(20)].map((data,key) => { text += possible.charAt(Math.floor(Math.random() * possible.length)); });
        return text;
    };

export function dragNdrop(){
     $('main .container').shapeshift({
        selector: 'div',
        minColumns: 3,
        colWidth: 235,
        align: 'left',
     });
    $('aside .tabs').shapeshift({
        selector: 'div',
        minColumns: 1,
         maxColumns: 1,
        colWidth: 300
    });
     $('.container').on( 'ss-added', function(e) {
        chrome.storage.local.clear();
        chrome.storage.local.set(createJson(), function() {
            console.info('Settings saved');
        });
    });
}

export function createControls(title,id, isTabs) {
    const controls = $('<span>', { 'class': `controls` });
    const h1 = $('<h1 contenteditable="true" class="lead" data-type="title">'+title+'</h1>');
    const close = $('<button>', { text:'Remove Row', 'class': 'danger','data-id':id });
    controls.append(h1);
    if (isTabs !== 'tabs') {
        controls.append(close);
    }
    return controls;
}


export function createRow(extraClass, title){
    const id = makeId();
    const container =  $('<div>', { 'id': id, 'class': `container ${extraClass}`,'data-id':id });
    const groupTitle = title ? title : 'untitled'
    container.append(createControls(groupTitle, id, extraClass))
    return container
}
$('#createRow').on('click', function () {
    const container = createRow('group',false);
    $('main').append(container);
    dragNdrop();
});

export function createTabs(){
    chrome.tabs.query({
        lastFocusedWindow: true     // In the current window
        }, function(tabs) {
            const container = createRow('tabs', 'Open Tabs');

            tabs.map(function(tab, index) {
                // console.log(tab)
                const tabTag = createChild('child tab', tab);
                container.append(tabTag)
            });

            $('aside').prepend(container);
        });
}

export function createMarks(json){
    // load(function (json) {
    console.log('json',json);
        Object.keys(json).map(function(key, index) {
            const group = json[key];
            var container = createRow('group',group.name);
                if (group.marks.length > 0) {
                    group.marks.map(function (data, index) {
                        console.log(data);
                        const child = createChild('child',data);
                        container.append(child);
                    });
                }
            $('main').append(container);
        });
    // });

}