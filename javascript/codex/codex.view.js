/**
 * Created by JetBrains WebStorm.
 * User: Milan Jaric
 * Date: 11/17/11
 * Time: 1:26 AM
 * To change this template use File | Settings | File Templates.
 */


(function($, codex) {
    /**
     *
     * @param id of the DOM element which represents view, if you need template use @see ViewTemplate
     */
    codex.View = function View(id) {
        var _this = this;
        var _context = $("#" + id);
        var _source = _context.data("source");

        this.dataBind = function() {
            $("[name^='" + _source.replace("DataSource", "") + "[']", _context).each(function(idx, el) {
                var ref = codex.dataSources.getDataSource(_source);
                var elementName = $(el).attr('name');
                var propertyName = elementName.replace(/\]\[|\[|\]/g, ".").replace(/.$/, "");
                if (el.nodeName.toLowerCase() in {"input":1, "button":1, "select":1, "option":1, "textarea":1}) {
                    $(el)
                        .val(ref.getValueOf(elementName))
                        .bind("change", function() {
                            //Todo: UNBIND previously bound HTML(FromChildElement)Element.change event handler, NEEDED FOR SELECT element
                            ref.setValueOf(elementName, $(el).val());
                        });
                    ref.data.onChanged(function(e) {

                        if (e.propertyName == propertyName) {
                            $(el).val(ref.getValueOf(elementName));
                        }
                    });

                } else {
                    $(el).text(ref.getValueOf(elementName));

                    ref.data.onChanged(function(e) {
                        
                        if (e.propertyName == propertyName) {
                            $(el).text(ref.getValueOf(elementName));
                        }
                    });
                }


            });
        };

        // finally init

        codex.dataSources.subscribeTo(_source, function() {
            _this.dataBind();
        });


    };

})(jQuery, window.codex);