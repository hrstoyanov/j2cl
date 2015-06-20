/*
 * Copyright 2015 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.j2cl.generator;

import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.collect.Lists;
import com.google.j2cl.ast.AssertStatement;
import com.google.j2cl.ast.BinaryExpression;
import com.google.j2cl.ast.Expression;
import com.google.j2cl.ast.ExpressionStatement;
import com.google.j2cl.ast.NewInstance;
import com.google.j2cl.ast.NumberLiteral;
import com.google.j2cl.ast.ParenthesizedExpression;
import com.google.j2cl.ast.PostfixExpression;
import com.google.j2cl.ast.PrefixExpression;
import com.google.j2cl.ast.Statement;
import com.google.j2cl.ast.VariableDeclaration;

import java.util.List;

/**
 * Generate javascript source code for {@code Statement}.
 * TODO: Keep an eye on performance and if things get slow then replace these String operations with
 * a StringBuilder.
 */
public class StatementSourceGenerator {
  public static String toSource(Statement statement) {
    if (statement instanceof AssertStatement) {
      return toSource((AssertStatement) statement);
    } else if (statement instanceof ExpressionStatement) {
      return toSource((ExpressionStatement) statement);
    } else if (statement instanceof VariableDeclaration) {
      return toSource((VariableDeclaration) statement);
    } else {
      throw new RuntimeException(
          "Need to implement toSource() for statement type: " + statement.getClass().getName());
    }
  }

  public static String toSource(Expression expression) {
    if (expression instanceof BinaryExpression) {
      return toSource((BinaryExpression) expression);
    } else if (expression instanceof NewInstance) {
      return toSource((NewInstance) expression);
    } else if (expression instanceof NumberLiteral) {
      return toSource((NumberLiteral) expression);
    } else if (expression instanceof ParenthesizedExpression) {
      return toSource((ParenthesizedExpression) expression);
    } else if (expression instanceof PostfixExpression) {
      return toSource((PostfixExpression) expression);
    } else if (expression instanceof PrefixExpression) {
      return toSource((PrefixExpression) expression);
    } else {
      throw new RuntimeException(
          "Need to implement toSource() for expression type: " + expression.getClass().getName());
    }
  }

  public static String toSource(AssertStatement statement) {
    if (statement.getMessage() == null) {
      return String.format(
          "Asserts.$enabled() && Asserts.$assert(%s);", toSource(statement.getExpression()));
    } else {
      return String.format(
          "Asserts.$enabled() && Asserts.$assertWithMessage(%s, %s);",
          toSource(statement.getExpression()),
          toSource(statement.getMessage()));
    }
  }

  public static String toSource(BinaryExpression expression) {
    return String.format(
        "%s %s %s",
        toSource(expression.getLeftOperand()),
        expression.getOperator().toString(),
        toSource(expression.getRightOperand()));
  }

  public static String toSource(ExpressionStatement statement) {
    return toSource(statement.getExpression()) + ";";
  }

  public static String toSource(NewInstance expression) {
    String className =
        TranspilerUtils.getClassName(expression.getConstructor().getEnclosingClassReference());
    String parameterSignature =
        ManglingNameUtils.getMangledParameterSignature(expression.getConstructor());
    String argumentsList =
        Joiner.on(", ").join(transformExpressionsToSource(expression.getArguments()));
    return String.format("%s.$create%s(%s)", className, parameterSignature, argumentsList);
  }

  public static String toSource(NumberLiteral expression) {
    return expression.getToken();
  }

  public static String toSource(ParenthesizedExpression expression) {
    return String.format("(%s)", toSource(expression.getExpression()));
  }

  public static String toSource(PostfixExpression expression) {
    return String.format(
        "%s%s", toSource(expression.getOperand()), expression.getOperator().toString());
  }

  public static String toSource(PrefixExpression expression) {
    return String.format(
        "%s%s", expression.getOperator().toString(), toSource(expression.getOperand()));
  }

  public static String toSource(VariableDeclaration statement) {
    return String.format(
        "var %s = %s;", statement.getVariable().getName(), toSource(statement.getInitializer()));
  }

  public static List<String> transformExpressionsToSource(List<Expression> expressions) {
    return Lists.transform(
        expressions,
        new Function<Expression, String>() {
          @Override
          public String apply(Expression expression) {
            return toSource(expression);
          }
        });
  }

  public static List<String> transformStatementsToSource(List<Statement> statements) {
    return Lists.transform(
        statements,
        new Function<Statement, String>() {
          @Override
          public String apply(Statement statement) {
            return toSource(statement);
          }
        });
  }
}
