function view(viewModel) {
    return <div ref={viewModel.divRef}><div ref={viewModel.explicitRef}><div ref={viewModel.nullableRef}></div></div></div>
}
function viewModel() { }

import React, { useCallback, useRef } from "react";

interface Widget {
    divRef: any;
    nullableRef: any;
    explicitRef: any;
    clickHandler: () => any;
    getHeight: () => any;
    restAttributes: any;
}

export default function Widget(props: {}) {
    const divRef = useRef<HTMLDivElement>();
    const nullableRef = useRef<HTMLDivElement>();
    const explicitRef = useRef<HTMLDivElement>();

    const clickHandler = useCallback(function clickHandler() {
        const html = divRef.current!.outerHTML + explicitRef.current!.outerHTML;
    }, [divRef, explicitRef])

    const getHeight = useCallback(function getHeight() {
        return divRef.current!.outerHTML + nullableRef.current?.outerHTML;
    }, [divRef, nullableRef]);

    const restAttributes=useCallback(function restAttributes(){
        const { ...restProps } = props;
        return restProps;
    }, [props]);

    return view(viewModel({
        ...props,
        clickHandler,
        divRef,
        nullableRef,
        explicitRef,
        getHeight,
        restAttributes: restAttributes()
    }));
}
