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

    $('#input_text').focus();

    chrome.tabs.query({'active':false}, function (tabs){

        for (var i=0; i<tabs.length; i++) {

            var tmpTab = tabs[i];

            $('body').append(
                $('<div></div>')
                .attr('id', tmpTab.id)
                .attr('class','tab')
                .attr('title', tmpTab.url) // "Alt" Text
                .append(
                    $('<img/>').attr('src', tmpTab.favIconUrl)
                    .attr('width', '16')
                    .attr('height', '16')
                ).append(
                    $('<span></span>').html($('<div/>').text(tmpTab.title).html()) // HTML Encode Title
                ).mouseover(function() {
                    $(this).css({'backgroundColor':'#eee'});
                }).mouseout(function() {
                    $(this).css({'backgroundColor':'#fff'});
                }).mousedown(function(e) {

                    var tabId = parseInt($(this).attr('id'));

                    if (e.which == 1) { // Left Click
                        chrome.tabs.update(tabId, {selected:true});
                    }
                    else if (e.which == 2) { // Middle Click
                        chrome.tabs.remove(tabId, function() {});
                        $(this).remove();
                    }
                })
            );
        }
    });
});
