/**
 * Impl hand rolled.
 */
goog.module('nativebootstrap.Util$impl');


const jre = goog.require('jre');


/**
 * Miscellaneous utility functions.
 */
class Util {
  /**
   * Return the value defined by a goog.define or the default value
   * if it is not defined.
   *
   * @param {string} name
   * @param {?string=} opt_defaultValue
   * @return {?string}
   * @public
   */
  static $getDefine(name, opt_defaultValue) {
    // Default the optional param. Note that we are not using the common
    // 'opt_value || default_value' pattern otherwise that would replace
    // empty string with null value.
    var defaultValue = opt_defaultValue == null ? null : opt_defaultValue;
    var rv = goog.getObjectByName(name);
    return rv == null ? defaultValue : String(rv);
  }

  /**
   * @param {*} ctor
   * @param {string} name
   * @public
   */
  static $setClassMetadata(ctor, name) {
    ctor.prototype.$$classMetadata = [name, Util.TYPE_CLASS];
  }

  /**
   * @param {*} ctor
   * @param {string} name
   * @public
   */
  static $setClassMetadataForInterface(ctor, name) {
    ctor.prototype.$$classMetadata = [name, Util.TYPE_INTERFACE];
  }

  /**
   * @param {*} ctor
   * @param {string} name
   * @public
   */
  static $setClassMetadataForEnum(ctor, name) {
    ctor.prototype.$$classMetadata = [name, Util.TYPE_ENUM];
  }

  /**
   * @param {*} ctor
   * @param {string} name
   * @public
   */
  static $setClassMetadataForPrimitive(ctor, name) {
    ctor.prototype.$$classMetadata = [name, Util.TYPE_PRIMITIVE];
  }

  /**
   * @param {*} ctor
   * @return {string}
   * @public
   */
  static $extractClassName(ctor) {
    if (jre.classMetadata == 'SIMPLE') {
      return ctor.prototype.$$classMetadata[0];
    } else if (jre.classMetadata == 'STRIPPED') {
      // TODO(goktug): use uniq ID
      return 'Class$obf';
    } else {
      throw new Error('Incorrect value: ' + jre.classMetadata);
    }
  }

  /**
   * @param {*} ctor
   * @return {number}
   * @public
   */
  static $extractClassType(ctor) {
    if (jre.classMetadata == 'SIMPLE') {
      return ctor.prototype.$$classMetadata[1];
    } else if (jre.classMetadata == 'STRIPPED') {
      return Util.TYPE_CLASS;
    } else {
      throw new Error('Incorrect value: ' + jre.classMetadata);
    }
  }

  /**
   * Returns whether the "from" class can be cast to the "to" class.
   *
   * Unlike instanceof, this function operates on classes instead of
   * instances.
   * @param {Function} fromClass
   * @param {Function} toClass
   * @return {boolean}
   * @public
   */
  static $canCastClass(fromClass, toClass) {
    return (
        fromClass != null &&
        (fromClass == toClass || fromClass.prototype instanceof toClass));
  }

  /**
   * Create a function that applies the specified jsFunctionMethod on itself,
   * and copies {@code instance}' properties to itself.
   *
   * @param {Function} jsFunctionMethod
   * @param {*} instance
   * @param {Function} copyMethod
   * @return {!Function}
   * @public
   */
  static $makeLambdaFunction(jsFunctionMethod, instance, copyMethod) {
    var lambda = function() {
      return jsFunctionMethod.apply(lambda, arguments);
    };
    copyMethod(instance, lambda);
    return lambda;
  }

  /**
   * Helper to access a field on the prototype since we don't current have a
   * way of representing this in our AST.
   * @param {Function} constructor
   * @return {*}
   * @public
   */
  static $getPrototype(constructor) {
    return constructor.prototype;
  }

  /**
   * Helper to accept a reference to something that should be synchronized on.
   * No synchronization is actually necessary since JS is singlethreaded but
   * it's important that the parameter be passed since the accessing of it
   * may have side effects that should be preserved.
   *
   * @param {*} value The value to synchronize on.
   * @public
   */
  static $synchronized(value) {}

  /**
   * Runs inline static field initializers.
   * @public
   */
  static $clinit() {}

  /**
   * Helper function used for metadata obfuscation, string replacement passes
   * can be targeted at this bottleneck.
   *
   * TODO(b/31782198): Because J2ClPass runs before ReplaceStrings and inlines
   * functions, the ReplaceStrings pass never sees calls to $setClassMetadata,
   * which makes this function neccessary.
   *
   * @param {string} className
   * @return {string}
   */
  static $makeClassName(className) {
    return className;
  }

  /**
   * Helper function used for enum obfuscation, string replacement passes
   * can be targeted at this bottleneck.
   *
   * @param {string} enumName
   * @return {string}
   */
  static $makeEnumName(enumName) {
    return enumName;
  }
}


/**
 * Used to store qualifier that is potentially side effecting.
 * @public {*}
 */
Util.$q = null;

/**
 * @type {number}
 */
Util.TYPE_CLASS = 0;

/**
 * @type {number}
 */
Util.TYPE_INTERFACE = 1;

/**
 * @type {number}
 */
Util.TYPE_ENUM = 2;

/**
 * @type {number}
 */
Util.TYPE_PRIMITIVE = 3;


/**
 * Exported class.
 */
exports = Util;