//
//  Dispatcher.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/18/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import Foundation


protocol Action {
    func perform(dispatcher: Dispatcher)
}

// TODO: rename
class Dispatcher {
    var store = AppStore()

    func run(action:Action) {
        action.perform(self)
    }
}