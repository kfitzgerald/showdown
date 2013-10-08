/*global module:true*/
/*
 * Basic definition list support with re-entrant parsing
 *
 * Definition Lists
 * ======
 *
 * Apple
 * :   Pomaceous fruit of plants of the genus Malus in the family Rosaceae.
 * :   An american computer company.
 *
 * Orange
 * :   The fruit of an evergreen tree of the genus Citrus.
 *
 *
 * *** NOTE ****
 * My implementation is lazy so definition lines do not support multiple line breaks. SO SORRY!
 *
 *
 * ** CUSTOMIZATION **
 * Definition Lists whose first term starts with a code block (e.g. `term`) will include a class named 'inline-def',
 *  useful for inline definition  lists (e.g. float: left)
 *
 */



(function(){

    var definitionList = function(converter) {
        return [

            // @username syntax
            {
                type: 'lang',
                filter: function(text) {

                    var lastOffset = 0,
                        lastLength = 0,
                        lastIndex = 0,
                        counter = 0,
                        sets = [];

                    text.replace(/([^\n]+)(\n:[ ]{3,}[^\n]+)+/g, function(match, p1, p2, offset, string) {
                        var isJoinedToLast = (lastOffset + lastLength + 1) == offset ;
                        lastOffset = offset;
                        lastLength = match.length;

                        // SPLIT IT UP
                        var parts = match.replace('\n','').split(':   '),
                            markup = '';

                        for(var i = 0; i < parts.length; i++) {
                            if (i == 0) {
                                markup += '<dt>'+converter.makeHtml(parts[i])+'</dt>';
                            } else {
                                markup += '<dd>'+converter.makeHtml(parts[i])+'</dd>';
                            }
                        }


                        if (isJoinedToLast) {
                            sets[lastIndex] += markup;
                            sets[counter] = '';
                        } else {
                            sets[counter] = markup;
                            lastIndex = counter;
                        }

                        counter++;

                        //definition
                    });

                    var postCounter = 0;
                    if (sets.length > 0) {

                        text = text.replace(/([^\n]+)(\n:[ ]{3,}[^\n]+)+/g, function(match, p1, p2, offset, string) {

//                            console.log('replacing index ' +postCounter + ' with ' + sets[postCounter].substr(0, 9));

                            if (sets[postCounter].length > 0) {
                                return '<dl'+(sets[postCounter].substr(0, 13) == '<dt><p><code>' ? ' class="inline-def"' : '')+'>'+sets[postCounter++]+'</dl>';
                            } else {
                                postCounter++;
                                return '';
                            }

                        });
                    }

                    return text;

                }
            }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.twitter = definitionList; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = definitionList;

}());
