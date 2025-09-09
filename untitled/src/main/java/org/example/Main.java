package org.example;

import java.util.HashMap;
import java.util.HashSet;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {

        int[] nums = {2, 7, 11, 15};
        int target = 9;

        int[] result = twoSum(nums, target);

        if (result != null) {
            System.out.println("Indices: " + result[0] + ", " + result[1]);
        } else {
            System.out.println("No solution found.");
        }

    }

    public static int[] twoSum(int[] nums, int target){
        HashMap<Integer, Integer> hs = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            if (hs.containsKey(complement)){
                return new int[] {hs.get(complement), i};
            }else {
                hs.put(nums[i], i);
            }
        }

        return null;
    }
}
