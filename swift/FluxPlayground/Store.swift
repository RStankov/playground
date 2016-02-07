//
//  Store.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/23/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import Foundation

protocol Storable : AnyObject {
    static func storeKeyForObject(object: Self) -> String
    static func storeKeyForId(id: Int) -> String
}

protocol StorableWithId : Storable {
    var id:Int { get }
}

extension StorableWithId {
    static func storeKeyForObject(object: Self) -> String {
        return "\(object.dynamicType)-\(object.id)"
    }

    static func storeKeyForId(id: Int) -> String {
        return "\(self)-\(id)"
    }
}

class StoreEntities {
    private var data = [String:Storable]()
    private var isChanged = false

    var isUpdated:Bool {
        get {
            return isChanged
        }
    }

    func copy() -> StoreEntities {
        let entries = StoreEntities()
        entries.data = data
        return entries
    }

    func set(object:Storable) {
        let key = "\(object.dynamicType)-\(object.id)"

        if data[key] !== object {
            data["\(object.dynamicType)-\(object.id)"] = object
            isChanged = true
        }
    }

    func set(objects:[AnyObject]) {
        // Note(rstankov): For some reason swift crashes if we expect [Sortable]
        objects.forEach { (object:AnyObject) in
            if let object = object as? Storable {
                self.set(object)
            }
        }
    }

    func get<T:Storable>(object:T) -> T {
        if let objectInStore = data["\(object.dynamicType)-\(object.id)"] as? T {
            return objectInStore
        }

        return object
    }

    func get<T:Storable>(type:T.Type, id:Int) -> T? {
        if let object = data["\(type)-\(id)"] as? T? {
            return object
        }

        return nil
    }
}


protocol StoreObserver : class, AnyObject {
    func storeDidChange()
}

struct StoreWeekObserverWrapper {
    private weak var observer:StoreObserver?

    init(_ observer: StoreObserver) {
        self.observer = observer
    }

    func get() -> StoreObserver? {
        return observer
    }
}

class Store<A> {
    private var entries = StoreEntities()

    final func handle(action:A) {
        let newEntries = reduce(entries.copy(), action: action)
        if newEntries.isUpdated {
            entries = newEntries.copy()
            notify()
        }
    }

    func get<T:Storable>(object:T) -> T {
        return entries.get(object)
    }

    func get<T:Storable>(type:T.Type, id:Int) -> T? {
        return entries.get(type, id: id)
    }

    func reduce(entries:StoreEntities, action:A) -> StoreEntities {
        return entries
    }

    private var observers = Array<StoreWeekObserverWrapper>()

    func addObserver(observer:StoreObserver) {
        observers.append(StoreWeekObserverWrapper(observer))
    }

    private func notify() {
        var cleanArray = false
        for wrapper in observers {
            if let observer = wrapper.get() {
                observer.storeDidChange()
            } else {
                cleanArray = true
            }
        }

        if cleanArray {
            observers = observers.filter({ (wrapper) -> Bool in
                return wrapper.observer != nil
            })
        }
    }
}