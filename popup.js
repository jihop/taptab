/*
 * Copyright (C) 2013 Jiho Park <jihop@jihopark.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
$(document).ready(function() {

    chrome.tabs.query({'currentWindow':true}, function (tabs){

        // Create List from Tabs
        for (var i=0; i<tabs.length; i++) {

            var tmpTab = tabs[i];

            $('body').append(
                $('<div></div>')
                .attr('id', tmpTab.id)
                .attr('title', tmpTab.url) // "Alt" Text
                .attr('class', (tmpTab.active)? 'tab highlighted active' : 'tab')
                .append(
                    $('<img/>').attr('src', tmpTab.favIconUrl)
                    .attr('width', '16')
                    .attr('height', '16')
                ).append(
                    $('<span></span>')
                    .html($('<div/>').text(tmpTab.title).html()) // HTML Encode Title
                ).mouseover(function() {
                    $('.highlighted').removeClass('highlighted');
                    $(this).addClass('highlighted');
                }).mouseup(function(e) {

                    var tabId = parseInt($(this).attr('id'));

                    if (e.which == 1) { // Left Click
                        chrome.tabs.update(tabId, {selected:true});
                    }
                    else if (e.which == 2) { // Middle Click
                        $(this).remove();
                        chrome.tabs.remove(tabId, function() {});
                    }
                })
            );
        }

        // Keyboard Binding
        $('body').keydown(function(e){

            if (e.keyCode == '37' || e.keyCode == '38') { // LEFT | UP

                var highlightedTab = $('.highlighted');
                var prevElement = $('.highlighted').prev();
                if (prevElement.hasClass('tab')) {
                    highlightedTab.removeClass('highlighted');
                    prevElement.addClass('highlighted');
                }

            } else if (e.keyCode == '39' || e.keyCode == '40') { // RIGHT | DOWN

                var highlightedTab = $('.highlighted');
                var nextElement = $('.highlighted').next();
                if (nextElement.hasClass('tab')) {
                    highlightedTab.removeClass('highlighted');
                    nextElement.addClass('highlighted');
                }

            } else if (e.keyCode == '13') { // ENTER

                var highlightedTabId = parseInt($('.highlighted').attr('id'));
                chrome.tabs.update(highlightedTabId, {selected:true});

            } else if (e.keyCode == '46') { // DELETE

                var highlightedTab = $('.highlighted');
                var highlightedTabId = parseInt(highlightedTab.attr('id'));

                // Determine tab to be highlighted next
                var newSelectedTab = highlightedTab.next();
                if (!newSelectedTab.hasClass('tab')) {
                    newSelectedTab = highlightedTab.prev(); // Select previous tab if next tab doesn't exist
                }
                newSelectedTab.addClass('highlighted');

                // Remove currently highlighted tab
                highlightedTab.remove();
                chrome.tabs.remove(highlightedTabId, function() {

                });
            }
        });
    });
});

// Re-Determine Active Tab
chrome.tabs.onActivated.addListener(function(activeInfo) {

    chrome.tabs.query({currentWindow:true, active:true}, function(tabs) {

        var activeTab = tabs[0];

        $('.active').removeClass('active');
        $('#' + activeTab.id).addClass('active');
    });
});

// Close Popup on new Tab Open
chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
    window.close();
});
