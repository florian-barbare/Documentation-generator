requirejs.config({
    baseUrl: 'js/utils',
    paths: {
        application: '../application',
        demo: '../demo',
        vendor: '../vendors',
        plugin: '../plug-ins',
        widget: '../widgets'
    }
});

requirejs([
	'plugin/CSS/AddClassOnClick',
    'vendor/d3js/3.5.5/d3',
    'application/graph/Graph',
    'events/eventListeners'
], function (AddClassOnClick, d3, Graph, eventListeners) {
    var graph,
        mobileMenu,
        docButtons,
        docCloseButton;

    function onResize() {
        graph.resize();
    }

    mobileMenu = new AddClassOnClick('data-menu-button', 'menu-active');
    mobileMenu.init();
    mobileMenu.custom = onResize;
	docCloseButton = new AddClassOnClick('data-doc-button-close', 'doc-active');
	docCloseButton.init();
    docCloseButton.custom = onResize;



    function buildLinks(nodes, config) {
        var key,
            link,
            target,
            source,
            dependencyIndex,
            links = [];

        for (key in nodes) {
            target = nodes[key];
            target.dependsGroups = target.dependsGroups || [];

            for (dependencyIndex in target.depends) {
                source = nodes[target.depends[dependencyIndex]];
                source.dependsGroups = source.dependsGroups || [];

                if (target.dependsGroups.indexOf(source.type) === -1) {
                    target.dependsGroups.push(source.type);
                }
                if (source.dependsGroups.indexOf(target.type) === -1) {
                    source.dependsGroups.push(target.type);
                }

                link = {
                    source : source,
                    target : target
                };
                link.strength = config.linkStrength;
                links.push(link);
            }
        }

        return links;
    }

    d3.json('config.json', function(json) {
        var wrapper,
            config = json;

        d3.json('data.json', function(json) {
            data = json;
            data.links = buildLinks(data.nodes, config);
            data.nodeValues = d3.values(data.nodes);

            graph = new Graph(data, data.categories, config);
            graph.create();

            docButtons = new AddClassOnClick('data-doc-button', 'doc-active', true);
            docButtons.init();
            docButtons.custom = onResize;
        });
    });

    eventListeners.add(window, 'resize', onResize);
});